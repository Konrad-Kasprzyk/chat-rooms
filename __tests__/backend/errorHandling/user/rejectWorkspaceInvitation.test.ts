import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testUserHasDeletedFlagError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import testWorkspaceHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testWorkspaceHasDeletedFlagError.util";
import testWorkspaceInRecycleBinError from "__tests__/utils/commonTests/backendErrors/testWorkspaceInRecycleBinError.util";
import testWorkspaceNotFoundError from "__tests__/utils/commonTests/backendErrors/testWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of rejecting a workspace invitation.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.user.rejectWorkspaceInvitation);
  });

  it("The user using the api has the deleted flag set.", async () => {
    await testUserHasDeletedFlagError(CLIENT_API_URLS.user.rejectWorkspaceInvitation);
  });

  it("The workspace document not found.", async () => {
    await testWorkspaceNotFoundError(CLIENT_API_URLS.user.rejectWorkspaceInvitation);
  });

  it("The workspace is in the recycle bin.", async () => {
    await testWorkspaceInRecycleBinError(CLIENT_API_URLS.user.rejectWorkspaceInvitation);
  });

  it("The workspace has the deleted flag set.", async () => {
    await testWorkspaceHasDeletedFlagError(CLIENT_API_URLS.user.rejectWorkspaceInvitation);
  });

  it("The user is not invited to the workspace.", async () => {
    const workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    const notInvitedUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(notInvitedUserId);

    const res = await fetchApi(CLIENT_API_URLS.user.rejectWorkspaceInvitation, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with id ${notInvitedUserId} is not invited to the workspace with id ${workspaceId}`
    );
  });
});
