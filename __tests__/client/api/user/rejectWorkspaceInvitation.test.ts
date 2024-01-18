import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDocs/usableOrInBin/checkUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import hideWorkspaceInvitation from "clientApi/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import rejectWorkspaceInvitation from "clientApi/user/rejectWorkspaceInvitation.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api rejecting the workspace invitation.", () => {
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
   * Creates workspaces to which the test user will be invited.
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
   * Every test creates and signs in a new user to test rejecting a workspace invitation.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
  });

  afterEach(async () => {
    await checkUser(testUser.uid);
  });

  it("Rejects the workspace invitation, when the user has only one invitation", async () => {
    await addUsersToWorkspace(workspaceIds[0], [], [testUser.email]);
    let testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 1)
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime.toMillis();

    await rejectWorkspaceInvitation(workspaceIds[0]);

    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await signInTestUser(workspacesOwner.uid);
    setOpenWorkspaceId(workspaceIds[0]);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 0
        )
      )
    );
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Rejects the workspace invitation, when the user has multiple invitations", async () => {
    for (let i = 0; i < workspaceIds.length; i++)
      await addUsersToWorkspace(workspaceIds[i], [], [testUser.email]);
    let testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid &&
            workspaceIds.every((id) => user.workspaceInvitationIds.includes(id))
        )
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime.toMillis();

    await rejectWorkspaceInvitation(workspaceIds[0]);

    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid &&
            user.workspaceInvitationIds.length == workspaceIds.length - 1
        )
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toEqual(workspaceIds.slice(1));
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await signInTestUser(workspacesOwner.uid);
    setOpenWorkspaceId(workspaceIds[0]);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 0
        )
      )
    );
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Rejects the workspace invitation, when the user already belongs to some workspaces", async () => {
    for (let i = 1; i < workspaceIds.length; i++)
      await addUsersToWorkspace(workspaceIds[i], [testUser.uid]);
    await addUsersToWorkspace(workspaceIds[0], [], [testUser.email]);
    let testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid &&
            workspaceIds.slice(1).every((id) => user.workspaceIds.includes(id)) &&
            user.workspaceInvitationIds.length == 1
        )
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime.toMillis();

    await rejectWorkspaceInvitation(workspaceIds[0]);

    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toEqual(workspaceIds.slice(1));
    expect(testUserDoc!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await signInTestUser(workspacesOwner.uid);
    setOpenWorkspaceId(workspaceIds[0]);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 0
        )
      )
    );
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Rejects a hidden workspace invitation", async () => {
    await addUsersToWorkspace(workspaceIds[0], [], [testUser.email]);
    let testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 1)
      )
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    await hideWorkspaceInvitation(workspaceIds[0]);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationsIds.includes(workspaceIds[0])
        )
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime.toMillis();

    await rejectWorkspaceInvitation(workspaceIds[0]);

    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    const testUserDetailsDoc = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid && userDetails.hiddenWorkspaceInvitationsIds.length == 0
        )
      )
    );
    expect(testUserDetailsDoc!.hiddenWorkspaceInvitationsIds).toBeArrayOfSize(0);
    await signInTestUser(workspacesOwner.uid);
    setOpenWorkspaceId(workspaceIds[0]);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 0
        )
      )
    );
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });
});
