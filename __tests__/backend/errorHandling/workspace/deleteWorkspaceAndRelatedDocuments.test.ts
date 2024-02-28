import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of deleting a workspace.", () => {
  const filename = path.parse(__filename).name;
  let workspaceCreatorId: string;

  /**
   * Creates and signs in the test user.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
  }, BEFORE_ALL_TIMEOUT);

  it("The workspace document not found.", async () => {
    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("The workspace document with id foo not found.");
  });

  it("The workspace is not in the recycle bin.", async () => {
    const workspaceId = await createTestWorkspace(filename);
    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} is not in the recycle bin.`
    );
  });

  it("The workspace does not have the deleted flag set.", async () => {
    const workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    await moveWorkspaceToRecycleBin();

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} does not have the deleted flag set.`
    );
  });

  it("The workspace is marked as deleted, but does not have the deletion time.", async () => {
    const workspaceId = await createTestWorkspace(filename);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp(),
      isDeleted: true,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} is marked as deleted, but does not have the deletion time.`
    );
  });

  it("The workspace is not marked as deleted long enough.", async () => {
    const workspaceId = await createTestWorkspace(filename);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp(),
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp(),
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} is not marked as deleted long enough.`
    );
  });
});
