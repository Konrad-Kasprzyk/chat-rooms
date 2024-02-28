import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUsersHistoryNotFoundError from "__tests__/utils/commonTests/backendErrors/historyNotFound/testUsersHistoryNotFoundError.util";
import testUserDoesNotBelongToWorkspaceError from "__tests__/utils/commonTests/backendErrors/testUserDoesNotBelongToWorkspaceError.util";
import testUserHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testUserHasDeletedFlagError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import testWorkspaceHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testWorkspaceHasDeletedFlagError.util";
import testWorkspaceInRecycleBinError from "__tests__/utils/commonTests/backendErrors/testWorkspaceInRecycleBinError.util";
import testWorkspaceNotFoundError from "__tests__/utils/commonTests/backendErrors/testWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of removing a user from a workspace.", () => {
  let workspaceId: string;
  let testUserId: string;
  let workspaceCreatorId: string;

  /**
   * Creates the test workspace and test users.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    const testUsers = await registerAndCreateTestUserDocuments(2);
    workspaceCreatorId = testUsers[0].uid;
    testUserId = testUsers[1].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      userIdToRemove: "foo",
    });
  });

  it("The workspace document not found.", async () => {
    await testWorkspaceNotFoundError(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      userIdToRemove: "foo",
    });
  });

  it("The users history document not found.", async () => {
    await testUsersHistoryNotFoundError(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      userIdToRemove: "foo",
    });
  });

  it("The user using the api has the deleted flag set.", async () => {
    await testUserHasDeletedFlagError(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      userIdToRemove: "foo",
    });
  });

  it("The workspace is in the recycle bin.", async () => {
    await testWorkspaceInRecycleBinError(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      userIdToRemove: "foo",
    });
  });

  it("The workspace has the deleted flag set.", async () => {
    await testWorkspaceHasDeletedFlagError(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      userIdToRemove: "foo",
    });
  });

  it("The user does not belong to the workspace.", async () => {
    await testUserDoesNotBelongToWorkspaceError(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      userIdToRemove: "foo",
    });
  });

  it("The document of the user to remove from the workspace not found.", async () => {
    await signInTestUser(workspaceCreatorId);
    const res = await fetchApi(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      workspaceId: workspaceId,
      userIdToRemove: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The document of the user with id foo to remove from the ` +
        `workspace with id ${workspaceId} not found.`
    );
  });

  it(
    "Found the document of the user to remove from the workspace, " +
      "but his user details document is not found.",
    async () => {
      await signInTestUser(workspaceCreatorId);
      const userWithoutUserDetails = (await registerAndCreateTestUserDocuments(1))[0];
      await adminCollections.userDetails.doc(userWithoutUserDetails.uid).delete();

      const res = await fetchApi(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
        workspaceId: workspaceId,
        userIdToRemove: userWithoutUserDetails.uid,
      });

      expect(res.ok).toBeFalse();
      expect(res.status).toEqual(500);
      expect(await res.json()).toEqual(
        `Found the document of the user to remove from the workspace, ` +
          `but his user details document with id ${userWithoutUserDetails.uid} is not found.`
      );
    }
  );

  it("The user to remove from the workspace does not belong to it.", async () => {
    await signInTestUser(workspaceCreatorId);
    const res = await fetchApi(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
      workspaceId: workspaceId,
      userIdToRemove: testUserId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with id ${testUserId} to remove from the workspace with ` +
        `id ${workspaceId} does not belong to it.`
    );
  });
});
