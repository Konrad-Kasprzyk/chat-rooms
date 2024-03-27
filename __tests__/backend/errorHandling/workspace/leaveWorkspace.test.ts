import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUsersHistoryNotFoundError from "__tests__/utils/commonTests/backendErrors/historyNotFound/testUsersHistoryNotFoundError.util";
import testUserDoesNotBelongToWorkspaceError from "__tests__/utils/commonTests/backendErrors/testUserDoesNotBelongToWorkspaceError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import testWorkspaceNotFoundError from "__tests__/utils/commonTests/backendErrors/testWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of leaving a workspace.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.workspace.leaveWorkspace, {
      workspaceId: "foo",
    });
  });

  it("Found the user document, but the user details document is not found.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.userDetails.doc(testUserId).delete();

    const res = await fetchApi(CLIENT_API_URLS.workspace.leaveWorkspace, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `Found the user document, but the user details document with id ${testUserId} is not found.`
    );
  });

  it("The workspace document not found.", async () => {
    await testWorkspaceNotFoundError(CLIENT_API_URLS.workspace.leaveWorkspace, {
      workspaceId: "foo",
    });
  });

  it("The users history document not found.", async () => {
    await testUsersHistoryNotFoundError(CLIENT_API_URLS.workspace.leaveWorkspace, {
      workspaceId: "foo",
    });
  });

  it("The workspace has the deleted flag set.", async () => {
    const workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isDeleted: true,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.leaveWorkspace, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} has the deleted flag set.`
    );
  });

  it("The user does not belong to the workspace.", async () => {
    await testUserDoesNotBelongToWorkspaceError(CLIENT_API_URLS.workspace.leaveWorkspace, {
      workspaceId: "foo",
    });
  });
});
