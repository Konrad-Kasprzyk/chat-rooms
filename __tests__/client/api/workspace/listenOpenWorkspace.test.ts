import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import cancelUserInvitationToWorkspace from "client/api/workspace/cancelUserInvitationToWorkspace.api";
import changeWorkspaceDescription from "client/api/workspace/changeWorkspaceDescription.api";
import changeWorkspaceTitle from "client/api/workspace/changeWorkspaceTitle.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import auth from "client/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api returning subject listening the open workspace document.", () => {
  let workspaceOwnerId: string;
  let workspaceId: string;
  let workspaceUrl: string;
  let workspaceTitle: string;
  let workspaceDescription: string;
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let filename = path.parse(__filename).name;

  /**
   * Creates the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    workspaceOwnerId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
    workspaceId = await createTestWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the workspaces owner. Opens the test workspace.
   * Updates the workspace title, description and url stored in the test variables.
   * Removes all other users from the workspace and cancels all invitations.
   * Checks that the test workspace is not in the recycle bin, marked as removed or removed.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid != workspaceOwnerId) {
      await signInTestUser(workspaceOwnerId);
      await firstValueFrom(
        listenCurrentUserDetails().pipe(
          filter((userDetails) => userDetails?.id == workspaceOwnerId)
        )
      );
    }
    if (getOpenWorkspaceId() != workspaceId) setOpenWorkspaceId(workspaceId);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    workspaceUrl = workspace!.url;
    workspaceTitle = workspace!.title;
    workspaceDescription = workspace!.description;
    const usersToRemoveFromWorkspace = workspace!.userIds.filter((uid) => uid != workspaceOwnerId);
    const userEmailsToCancelInvitation = workspace!.invitedUserEmails;
    await removeUsersFromWorkspace(
      workspaceId,
      usersToRemoveFromWorkspace,
      userEmailsToCancelInvitation
    );
  }, LONG_BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    await checkWorkspace(workspaceId);
  });

  it("Returns a null when the user is not signed in.", async () => {
    await signOut();

    const openWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace == null))
    );

    expect(openWorkspace).toBeNull();
    // Signing in the workspace creator is required to check newly created workspace.
    await signInTestUser(workspaceOwnerId);
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceTitle,
      workspaceDescription,
      workspaceUrl
    );
  });

  it("Returns a null when no workspace is open.", async () => {
    setOpenWorkspaceId(null);

    const openWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace == null))
    );

    expect(openWorkspace).toBeNull();
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceTitle,
      workspaceDescription,
      workspaceUrl
    );
  });

  it("Returns the open workspace document.", async () => {
    const openWorkspace = await firstValueFrom(listenOpenWorkspace());

    expect(openWorkspace).not.toBeNull();
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceTitle,
      workspaceDescription,
      workspaceUrl
    );
  });

  it("Returns the open workspace document document after signing out and in.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    await signOut();
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
    await signInTestUser(workspaceOwnerId);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId)));

    const openWorkspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    expect(openWorkspace).not.toBeNull();
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceTitle,
      workspaceDescription,
      workspaceUrl
    );
  });

  it("Returns the open workspace document, when the user signs out and the different user signs in.", async () => {
    await addUsersToWorkspace(workspaceId, [testUser.uid]);
    const openWorkspaceSubject = listenOpenWorkspace();
    await signOut();
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
    await signInTestUser(testUser.uid);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));

    const openWorkspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    expect(openWorkspace).not.toBeNull();
  });

  it("Returns the open workspace document, when the open workspace id is set to a different id.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    const newWorkspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(newWorkspaceId);

    const workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == newWorkspaceId))
    );

    expect(workspace!.id).toEqual(newWorkspaceId);
  });

  it("Returns the open workspace document, when the open workspace id is set to null and later set to the same id.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    setOpenWorkspaceId(null);
    await firstValueFrom(openWorkspaceSubject.pipe(filter((workspace) => workspace == null)));
    setOpenWorkspaceId(workspaceId);

    const workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    expect(workspace!.id).toEqual(workspaceId);
  });

  it("Returns the open workspace document, when the open workspace id is set to null and later set to a different id.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    const newWorkspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(null);
    await firstValueFrom(openWorkspaceSubject.pipe(filter((workspace) => workspace == null)));
    setOpenWorkspaceId(newWorkspaceId);

    const workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == newWorkspaceId))
    );

    expect(workspace!.id).toEqual(newWorkspaceId);
  });

  it("Updates the workspace when the title changes.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime;
    const newTitle = "changed " + workspace!.title;

    await changeWorkspaceTitle(newTitle);
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.title == newTitle)
      )
    );

    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.title).toEqual(newTitle);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Updates the workspace when the description changes.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime;
    const newDescription = "changed " + workspace!.description;

    await changeWorkspaceDescription(newDescription);
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.description == newDescription
        )
      )
    );

    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.description).toEqual(newDescription);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Updates the workspace when a user is invited to the workspace.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime;

    await inviteUserToWorkspace(testUser.email);
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );

    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.userIds).toEqual([workspaceOwnerId]);
    expect(workspace!.invitedUserEmails).toEqual([testUser.email]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Updates the workspace when the workspace owner cancels an invitation to the workspace.", async () => {
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );
    const oldModificationTime = workspace!.modificationTime;

    await cancelUserInvitationToWorkspace(testUser.email);
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.invitedUserEmails.length == 0
        )
      )
    );

    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.userIds).toEqual([workspaceOwnerId]);
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Updates the workspace when a user accepts an invitation to the workspace.", async () => {
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );
    const oldModificationTime = workspace!.modificationTime;

    await addUsersToWorkspace(workspaceId, [testUser.uid]);
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId &&
            workspace.userIds.includes(testUser.uid) &&
            workspace.invitedUserEmails.length == 0
        )
      )
    );

    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.userIds).toEqual([workspaceOwnerId, testUser.uid].sort());
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Updates the workspace when a user rejects an invitation to the workspace.", async () => {
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );
    const oldModificationTime = workspace!.modificationTime;

    await removeUsersFromWorkspace(workspaceId, [], [testUser.email]);
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId &&
            workspace.userIds.length == 1 &&
            workspace.invitedUserEmails.length == 0
        )
      )
    );

    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.userIds).toEqual([workspaceOwnerId]);
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Returns a null when the workspace is put in the recycle bin.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    const newWorkspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(newWorkspaceId);
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == newWorkspaceId))
    );

    await moveWorkspaceToRecycleBin();
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace == null))
    );

    expect(workspace).toBeNull();
    await checkWorkspace(newWorkspaceId);
  });

  //TODO
  it.skip("Updates the workspace when the workspace is restored from the recycle bin.", async () => {});

  it("Sends a null when the workspace document is deleted.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    const newWorkspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(newWorkspaceId);
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == newWorkspaceId))
    );

    adminCollections.workspaces.doc(newWorkspaceId).delete();
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace == null))
    );

    expect(workspace).toBeNull();
  });

  it("Sends null when the workspace document is marked deleted.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    const newWorkspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(newWorkspaceId);
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == newWorkspaceId))
    );

    adminCollections.workspaces.doc(newWorkspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isDeleted: true,
    });
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace == null))
    );

    expect(workspace).toBeNull();
  });
});
