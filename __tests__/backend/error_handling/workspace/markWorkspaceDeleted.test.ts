import globalBeforeAll from "__tests__/globalBeforeAll";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import { WORKSPACE_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import { FieldValue, Timestamp as adminTimestamp } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of marking a workspace deleted.", () => {
  let workspaceCreatorId: string;
  let workspaceId: string;
  const placingInBinTime = adminTimestamp.fromMillis(
    new Date().getTime() - WORKSPACE_DAYS_IN_BIN * 24 * 60 * 60 * 1000
  );

  /**
   * Creates and opens the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  });

  beforeEach(async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: placingInBinTime,
      insertedIntoBinByUserId: workspaceCreatorId,
    });
  });

  it("The workspace document not found.", async () => {
    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`The workspace document with id foo not found.`);
  });

  it("The workspace has the deleted flag set already.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The workspace with id ${workspaceId} has the deleted flag set already.`
    );
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The workspace is not in the recycle bin.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: false,
      placingInBinTime: null,
      insertedIntoBinByUserId: null,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The workspace with id ${workspaceId} is not in the recycle bin.`
    );
  });

  it(
    "The workspace is in the recycle bin, but does not have " +
      "a time set when it was placed in the recycle bin.",
    async () => {
      await adminCollections.workspaces.doc(workspaceId).update({
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
        isInBin: true,
        placingInBinTime: null,
      });

      const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
        workspaceId,
      });

      expect(res.ok).toBeFalse();
      expect(res.status).toEqual(500);
      expect(await res.text()).toEqual(
        `The workspace with id ${workspaceId} is in the recycle bin, but does not have ` +
          `a time set when it was placed in the recycle bin.`
      );
    }
  );

  it("Workspace is not long enough in the recycle bin.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.markWorkspaceDeleted, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `Workspace with id ${workspaceId} is not long enough in the recycle bin.`
    );
  });
});
