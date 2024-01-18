import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testUserHasDeletedFlagError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import testWorkspaceHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testWorkspaceHasDeletedFlagError.util";
import testWorkspaceInRecycleBinError from "__tests__/utils/commonTests/backendErrors/testWorkspaceInRecycleBinError.util";
import testWorkspaceNotFoundError from "__tests__/utils/commonTests/backendErrors/testWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestEmptyWorkspace from "__tests__/utils/workspace/createTestEmptyWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of hiding a workspace invitation.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.user.hideWorkspaceInvitation);
  });

  it("The user using the api has the deleted flag set.", async () => {
    await testUserHasDeletedFlagError(CLIENT_API_URLS.user.hideWorkspaceInvitation);
  });

  it("The user details document not found.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.userDetails.doc(testUserId).delete();

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `The user details document with id ${testUserId} not found, but found the user document.`
    );
  });

  it("The user details document has the deleted flag set, but the user document does not.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.userDetails.doc(testUserId).update({ isDeleted: true });

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `The user details document with id ${testUserId} has the deleted flag set, ` +
        `but the user document does not have the deleted flag set.`
    );
  });

  it("The workspace document not found.", async () => {
    await testWorkspaceNotFoundError(CLIENT_API_URLS.user.hideWorkspaceInvitation);
  });

  it("The workspace is in the recycle bin.", async () => {
    await testWorkspaceInRecycleBinError(CLIENT_API_URLS.user.hideWorkspaceInvitation);
  });

  it("The workspace has the deleted flag set.", async () => {
    await testWorkspaceHasDeletedFlagError(CLIENT_API_URLS.user.hideWorkspaceInvitation);
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
    const workspaceId = await createTestEmptyWorkspace(filename);
    const notInvitedUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(notInvitedUserId);

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with id ${notInvitedUserId} is not invited to the workspace with id ${workspaceId}`
    );
  });
});
