import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import inviteUserToWorkspace from "clientApi/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test inviting a user to the workspace.", () => {
  let workspacesOwner: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let workspaceIds: string[] = [];
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;

  /**
   * Creates workspaces to invite user
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    for (let i = 0; i < 3; i++) workspaceIds.push(await createTestWorkspace(filename));
    workspaceIds.sort();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Each test creates a new user to invite. Signs in the workspaces owner.
   * Cancels all invitations to the test workspaces.
   * Ensures that the workspace owner is the only member of each workspace.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const testWorkspacesSnap = await adminCollections.workspaces
      .where("id", "in", workspaceIds)
      .get();
    expect(testWorkspacesSnap.size).toEqual(workspaceIds.length);
    const testWorkspaces = testWorkspacesSnap.docs.map((doc) => doc.data());
    const promises = [];
    for (const workspace of testWorkspaces) {
      expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
      const userEmailsToCancelInvitation = workspace!.invitedUserEmails;
      if (userEmailsToCancelInvitation.length > 0)
        promises.push(removeUsersFromWorkspace(workspace.id, [], userEmailsToCancelInvitation));
    }
    await Promise.all(promises);
  }, LONG_BEFORE_EACH_TIMEOUT);

  // All operations are performed on the first workspace, but just in case check also the last workspace.
  afterEach(async () => {
    await checkWorkspace(workspaceIds[0]);
    await checkWorkspace(workspaceIds[workspaceIds.length - 1]);
  });

  it("Invites the user to the workspace, when the user has no invitations", async () => {
    setOpenWorkspaceId(workspaceIds[0]);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceIds[0]))
    );
    const oldModificationTime = workspace!.modificationTime;

    await inviteUserToWorkspace(testUser.email);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 1
        )
      )
    );
    expect(workspace!.invitedUserEmails).toEqual([testUser.email]);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await signInTestUser(testUser.uid);
    const testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 1)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Invites the user to the workspace, when the user has multiple invitations", async () => {
    const promises = [];
    for (let i = 1; i < workspaceIds.length; i++)
      promises.push(addUsersToWorkspace(workspaceIds[i], [], [testUser.email]));
    await Promise.all(promises);
    setOpenWorkspaceId(workspaceIds[0]);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceIds[0]))
    );
    const oldModificationTime = workspace!.modificationTime;

    await inviteUserToWorkspace(testUser.email);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 1
        )
      )
    );
    expect(workspace!.invitedUserEmails).toEqual([testUser.email]);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await signInTestUser(testUser.uid);
    const testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid && user.workspaceInvitationIds.length == workspaceIds.length
        )
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toEqual(workspaceIds);
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Invites the user to the workspace, when the user already belongs to some workspaces", async () => {
    const promises = [];
    for (let i = 1; i < workspaceIds.length; i++)
      promises.push(addUsersToWorkspace(workspaceIds[i], [testUser.uid]));
    await Promise.all(promises);
    setOpenWorkspaceId(workspaceIds[0]);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceIds[0]))
    );
    const oldModificationTime = workspace!.modificationTime;

    await inviteUserToWorkspace(testUser.email);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 1
        )
      )
    );
    expect(workspace!.invitedUserEmails).toEqual([testUser.email]);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await signInTestUser(testUser.uid);
    const testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 1)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc!.workspaceIds).toEqual(workspaceIds.slice(1));
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
  });
});
