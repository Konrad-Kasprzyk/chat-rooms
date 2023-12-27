import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersToWorkspace } from "__tests__/utils/addUsersToWorkspace.util";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import fetchApi from "client_api/utils/fetchApi.util";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import auth from "common/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of canceling a user invitation to a workspace.", () => {
  let workspaceCreatorId: string;
  let validInvitedUser: {
    uid: string;
    email: string;
    displayName: string;
  };
  let workspaceId: string;

  /**
   * Creates and opens the test workspace and invites the test user.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    validInvitedUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await addUsersToWorkspace(workspaceId, [], [validInvitedUser.email]);
  });

  /**
   * Signs in the workspace creator. Ensures that the test user is invited.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid !== workspaceCreatorId)
      await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId &&
            workspace.invitedUserEmails.includes(validInvitedUser.email)
        )
      )
    );
  });

  it("The document of user using the api not found.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: validInvitedUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The document of user using the api with id ${registeredOnlyUser.uid} not found.`
    );
  });

  it("The user using the api has the deleted flag set.", async () => {
    await adminCollections.users.doc(workspaceCreatorId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: validInvitedUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user using the api with id ${workspaceCreatorId} has the deleted flag set.`
    );
    await adminCollections.users.doc(workspaceCreatorId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The workspace document not found.", async () => {
    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId: "foo",
      targetUserEmail: validInvitedUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`The workspace document with id foo not found.`);
  });

  it("The workspace has the deleted flag set.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: validInvitedUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The workspace with id ${workspaceId} has the deleted flag set.`
    );
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The user to cancel an invitation not found.", async () => {
    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user document with email foo not found or has the deleted flag set.`
    );
  });

  it("The user to cancel an invitation has the deleted flag set.", async () => {
    await adminCollections.users.doc(validInvitedUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: validInvitedUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user document with email ${validInvitedUser.email} not found or has the deleted flag set.`
    );
    await adminCollections.users.doc(validInvitedUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("Found multiple user documents with the provided email.", async () => {
    const newUser = (await registerAndCreateTestUserDocuments(1))[0];
    await adminCollections.users.doc(newUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      email: validInvitedUser.email,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: validInvitedUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.text()).toEqual(
      `Found multiple user documents with email ${validInvitedUser.email}`
    );
    await adminCollections.users.doc(newUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      email: newUser.email,
    });
  });

  it("The user using the api does not belong to the workspace.", async () => {
    const newUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(newUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: validInvitedUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user using the api with id ${newUser.uid} does not belong to the workspace with id ${workspaceId}`
    );
  });

  it("The user to cancel an invitation is not invited to the workspace.", async () => {
    const newUser = (await registerAndCreateTestUserDocuments(1))[0];

    const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
      workspaceId,
      targetUserEmail: newUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user with email ${newUser.email} is not invited to the workspace with id ${workspaceId}`
    );
  });
});
