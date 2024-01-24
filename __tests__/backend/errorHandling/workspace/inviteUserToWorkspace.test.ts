import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserDoesNotBelongToWorkspaceError from "__tests__/utils/commonTests/backendErrors/testUserDoesNotBelongToWorkspaceError.util";
import testUserHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testUserHasDeletedFlagError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import testWorkspaceHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testWorkspaceHasDeletedFlagError.util";
import testWorkspaceInRecycleBinError from "__tests__/utils/commonTests/backendErrors/testWorkspaceInRecycleBinError.util";
import testWorkspaceNotFoundError from "__tests__/utils/commonTests/backendErrors/testWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import MAX_INVITED_USERS from "common/constants/maxInvitedUsers.constant";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of inviting a user to a workspace.", () => {
  let workspaceId: string;
  let workspaceCreatorId: string;

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

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      targetUserEmail: "foo",
    });
  });

  it("The workspace document not found.", async () => {
    await testWorkspaceNotFoundError(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      targetUserEmail: "foo",
    });
  });

  it("The user using the api has the deleted flag set.", async () => {
    await testUserHasDeletedFlagError(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      targetUserEmail: "foo",
    });
  });

  it("The workspace is in the recycle bin.", async () => {
    await testWorkspaceInRecycleBinError(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      targetUserEmail: "foo",
    });
  });

  it("The workspace has the deleted flag set.", async () => {
    await testWorkspaceHasDeletedFlagError(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      targetUserEmail: "foo",
    });
  });

  it("The user does not belong to the workspace.", async () => {
    await testUserDoesNotBelongToWorkspaceError(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      targetUserEmail: "foo",
    });
  });

  it("The workspace has a maximum number of invited users.", async () => {
    await signInTestUser(workspaceCreatorId);
    const fakeUserEmails: string[] = [];
    for (let i = 0; i < MAX_INVITED_USERS; i++) fakeUserEmails.push(`fakeEmail${i}@foo`);
    await adminCollections.workspaces.doc(workspaceId).update({
      invitedUserEmails: fakeUserEmails,
      modificationTime: FieldValue.serverTimestamp(),
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} has a maximum number of invited users.`
    );
    await adminCollections.workspaces.doc(workspaceId).update({
      invitedUserEmails: [],
      modificationTime: FieldValue.serverTimestamp(),
    });
  });

  it("The user to cancel an invitation not found, because the user document does not exists.", async () => {
    await signInTestUser(workspaceCreatorId);

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      "The user document with email foo not found or has the deleted flag set."
    );
  });

  it("The user to cancel an invitation not found, because the user document has the deleted flag set.", async () => {
    await signInTestUser(workspaceCreatorId);
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await adminCollections.users
      .doc(testUser.uid)
      .update({ isDeleted: true, modificationTime: FieldValue.serverTimestamp() });

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: testUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user document with email ${testUser.email} not found or has the deleted flag set.`
    );
  });

  it("Found multiple user documents with the provided email.", async () => {
    await signInTestUser(workspaceCreatorId);
    const testUsers = await registerAndCreateTestUserDocuments(2);
    await adminCollections.users.doc(testUsers[1].uid).update({
      email: testUsers[0].email,
      modificationTime: FieldValue.serverTimestamp(),
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: testUsers[0].email,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `Found multiple user documents with email ${testUsers[0].email}`
    );
  });

  it("The user is already invited to the workspace.", async () => {
    await signInTestUser(workspaceCreatorId);
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: testUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with email ${testUser.email} is already invited to the workspace with id ${workspaceId}`
    );
  });
});
