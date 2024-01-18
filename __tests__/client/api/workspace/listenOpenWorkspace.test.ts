import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import checkWorkspace from "__tests__/utils/checkDocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import signOut from "clientApi/user/signOut.api";
import cancelUserInvitationToWorkspace from "clientApi/workspace/cancelUserInvitationToWorkspace.api";
import changeWorkspaceDescription from "clientApi/workspace/changeWorkspaceDescription.api";
import changeWorkspaceTitle from "clientApi/workspace/changeWorkspaceTitle.api";
import inviteUserToWorkspace from "clientApi/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace, {
  _listenOpenWorkspaceExportedForTesting,
} from "clientApi/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "clientApi/workspace/moveWorkspaceToRecycleBin.api";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import auth from "common/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
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
    expect(workspace!.isDeleted).toBeFalse();
    expect(workspace!.isInBin).toBeFalse();
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
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
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
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );
  });

  it("Returns the open workspace document.", async () => {
    const openWorkspace = await firstValueFrom(listenOpenWorkspace());

    expect(openWorkspace).not.toBeNull();
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
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
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
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
    const oldModificationTime = workspace!.modificationTime.toMillis();
    const newTitle = "changed " + workspace!.title;

    await changeWorkspaceTitle(newTitle);
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.title == newTitle)
      )
    );

    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.title).toEqual(newTitle);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Updates the workspace when the description changes.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime.toMillis();
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
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Updates the workspace when a user is invited to the workspace.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    let workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime.toMillis();

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
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
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
    const oldModificationTime = workspace!.modificationTime.toMillis();

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
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
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
    const oldModificationTime = workspace!.modificationTime.toMillis();

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
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
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
    const oldModificationTime = workspace!.modificationTime.toMillis();

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
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  //TODO
  it.skip("Updates the workspace when a column is modified.", async () => {});
  it.skip("Updates the workspace when a new column is added.", async () => {});
  it.skip("Updates the workspace when a label is modified.", async () => {});
  it.skip("Updates the workspace when a new label is added.", async () => {});

  //TODO implement this test after implementing tasks api
  it.skip("Subject returns no updates, when a workspace has a new task created", async () => {});
  //TODO implement this test after implementing tasks api
  it.skip("Subject returns no updates, when a workspace has a task modified", async () => {});

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
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
    });
    workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(filter((workspace) => workspace == null))
    );

    expect(workspace).toBeNull();
  });

  // TODO check if this test passes when firestore rules are implemented.
  it.skip("Subject returns an error if the user does not belong to the workspace.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    await signInTestUser(testUser.uid);
    setOpenWorkspaceId(workspaceId);

    await expect(firstValueFrom(openWorkspaceSubject)).toReject();
  });

  it("After an error and function re-call, returns the open workspace document.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    if (!_listenOpenWorkspaceExportedForTesting)
      throw new Error("listenOpenWorkspace.api module didn't export functions for testing.");

    _listenOpenWorkspaceExportedForTesting.setSubjectError();
    await expect(firstValueFrom(openWorkspaceSubject)).toReject();
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    expect(workspace).not.toBeNull();
  });
});
