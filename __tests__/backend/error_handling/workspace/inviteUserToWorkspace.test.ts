import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
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

describe("Test errors of inviting a user to a workspace.", () => {
  let workspaceCreatorId: string;
  let userToInvite: {
    uid: string;
    email: string;
    displayName: string;
  };
  let workspaceId: string;

  /**
   * Creates and opens the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    userToInvite = (await registerAndCreateTestUserDocuments(1))[0];
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
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the workspace creator. Ensures that the test user is not invited.
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
          (workspace) => workspace?.id == workspaceId && workspace.invitedUserEmails.length == 0
        )
      )
    );
  });

  it("The document of the user using the api not found.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: userToInvite.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user using the api document with id ${registeredOnlyUser.uid} not found.`
    );
  });

  it("The user using the api has the deleted flag set.", async () => {
    await adminCollections.users.doc(workspaceCreatorId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: userToInvite.email,
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
    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId: "foo",
      targetUserEmail: userToInvite.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`The workspace document with id foo not found.`);
  });

  it("The workspace is in the recycle bin.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
      insertedIntoBinByUserId: workspaceCreatorId,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: userToInvite.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`The workspace with id ${workspaceId} is in the recycle bin.`);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: false,
      placingInBinTime: null,
      insertedIntoBinByUserId: null,
    });
  });

  it("The user to invite not found.", async () => {
    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user document with email foo not found or has the deleted flag set.`
    );
  });

  it("The user to invite has the deleted flag set.", async () => {
    await adminCollections.users.doc(userToInvite.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: userToInvite.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user document with email ${userToInvite.email} not found or has the deleted flag set.`
    );
    await adminCollections.users.doc(userToInvite.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("Found multiple user documents with the provided email.", async () => {
    const newUser = (await registerAndCreateTestUserDocuments(1))[0];
    await adminCollections.users.doc(newUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      email: userToInvite.email,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: userToInvite.email,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.text()).toEqual(
      `Found multiple user documents with email ${userToInvite.email}`
    );
    await adminCollections.users.doc(newUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      email: newUser.email,
    });
  });

  it("The user using the api does not belong to the workspace.", async () => {
    const newUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(newUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: userToInvite.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user using the api with id ${newUser.uid} does not belong to the workspace with id ${workspaceId}`
    );
  });

  it("The user to invite is already invited to the workspace.", async () => {
    const newUser = (await registerAndCreateTestUserDocuments(1))[0];

    let res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: newUser.email,
    });
    expect(res.ok).toBeTrue();
    res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
      workspaceId,
      targetUserEmail: newUser.email,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user with email ${newUser.email} is already invited to the workspace with id ${workspaceId}`
    );
  });
});
