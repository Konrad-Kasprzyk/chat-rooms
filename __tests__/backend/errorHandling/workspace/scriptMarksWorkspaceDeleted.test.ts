import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of script marking a workspace deleted.", () => {
  let workspaceCreatorId: string;
  let workspaceId: string;

  /**
   * Creates the test workspace.
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
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  it("The workspace document not found.", async () => {
    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(`The workspace document with id foo not found.`);
  });

  it("The workspace is not in the recycle bin.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: false,
      placingInBinTime: null,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} is not in the recycle bin.`
    );
  });

  it(
    "The workspace is in the recycle bin, but does not have " +
      "a time set when it was placed in the recycle bin.",
    async () => {
      await adminCollections.workspaces.doc(workspaceId).update({
        modificationTime: FieldValue.serverTimestamp(),
        isInBin: true,
        placingInBinTime: null,
      });

      const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
        workspaceId,
      });

      expect(res.ok).toBeFalse();
      expect(res.status).toEqual(500);
      expect(await res.json()).toEqual(
        `The workspace with id ${workspaceId} is in the recycle bin, but does not have ` +
          `a time set when it was placed in the recycle bin.`
      );
    }
  );

  it("The workspace has the deleted flag set already.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp(),
      isDeleted: true,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} has the deleted flag set already.`
    );
  });

  it("Workspace is not long enough in the recycle bin.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp(),
      isDeleted: false,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `Workspace with id ${workspaceId} is not long enough in the recycle bin.`
    );
  });
});
