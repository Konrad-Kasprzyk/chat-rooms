import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import { DAYS_TO_DELETE_DOC } from "common/constants/timeToDeleteDoc.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import { FieldValue, Timestamp as adminTimestamp } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of deleting a workspace.", () => {
  let workspaceId: string;
  const deletionTime = adminTimestamp.fromMillis(
    new Date().getTime() - DAYS_TO_DELETE_DOC * 24 * 60 * 60 * 1000
  );

  /**
   * Creates and opens the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    const userId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(userId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == userId)));
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  }, BEFORE_ALL_TIMEOUT);

  beforeEach(async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: deletionTime,
    });
  });

  it("The workspace does not have the deleted flag set.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The workspace with id ${workspaceId} does not have the deleted flag set.`
    );
  });

  it(
    "The workspace has the deleted flag set, but does not have a time " +
      "when the deleted flag was set.",
    async () => {
      await adminCollections.workspaces.doc(workspaceId).update({
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
        isDeleted: true,
        deletionTime: null,
      });

      const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
        workspaceId,
      });

      expect(res.ok).toBeFalse();
      expect(res.status).toEqual(500);
      expect(await res.text()).toEqual(
        `The workspace with id ${workspaceId} has the deleted flag set, but does not have a time ` +
          `when the deleted flag was set.`
      );
    }
  );

  it("The workspace does not have the deleted flag set long enough.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchTestApi(SCRIPT_API_URLS.workspace.deleteWorkspaceAndRelatedDocuments, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The workspace with id ${workspaceId} does not have the deleted flag set long enough.`
    );
  });
});
