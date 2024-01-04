import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestEmptyWorkspace from "__tests__/utils/workspace/createTestEmptyWorkspace.util";
import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import auth from "common/db/auth.firebase";
import Workspace from "common/models/workspace_models/workspace.model";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of hiding a workspace invitation.", () => {
  let invitedUser: {
    uid: string;
    email: string;
    displayName: string;
  };
  let workspaceCreatorId: string;
  let workspaceId: string;

  /**
   * Creates the test workspace and invites the test user.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    invitedUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
    await addUsersToWorkspace(workspaceId, [], [invitedUser.email]);
    await signInTestUser(invitedUser.uid);
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the invited user. Ensures that the user is invited.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid !== invitedUser.uid)
      await signInTestUser(invitedUser.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == invitedUser.uid && user.workspaceInvitationIds.length == 1)
      )
    );
  });

  it("The document of the user using the api not found.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      invitedUserEmails: adminArrayUnion<Workspace, "invitedUserEmails">(registeredOnlyUser.email),
    });

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, { workspaceId });

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(
      `The user document with id ${registeredOnlyUser.uid} not found.`
    );
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(registeredOnlyUser.email),
    });
  });

  it("The user using the api has the deleted flag set.", async () => {
    await adminCollections.users.doc(invitedUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(
      `The user with id ${invitedUser.uid} has the deleted flag set.`
    );
    await adminCollections.users.doc(invitedUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The user details document of the user using the api not found.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    await signInTestUser(testUser.uid);
    await adminCollections.userDetails.doc(testUser.uid).delete();

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, { workspaceId });

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(
      `The user details document with id ${testUser.uid} not found.`
    );
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(testUser.email),
    });
  });

  it("The workspace document not found.", async () => {
    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, {
      workspaceId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(`The workspace document with id foo not found.`);
  });

  it("The workspace has the deleted flag set.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} has the deleted flag set.`
    );
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The user is not invited to the workspace.", async () => {
    const notInvitedUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(notInvitedUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.user.hideWorkspaceInvitation, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(await res.json()).toEqual(
      `The user with id ${notInvitedUser.uid} is not invited to the workspace with id ${workspaceId}`
    );
  });
});
