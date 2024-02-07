import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDTODocs/usableOrInBin/checkUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import hideWorkspaceInvitation from "client/api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import rejectWorkspaceInvitation from "client/api/user/rejectWorkspaceInvitation.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
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
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
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
    const oldModificationTime = testUserDoc!.modificationTime;

    await rejectWorkspaceInvitation(workspaceIds[0]);

    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
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
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Rejects the workspace invitation, when the user has multiple invitations", async () => {
    const promises = [];
    for (let i = 0; i < workspaceIds.length; i++)
      promises.push(addUsersToWorkspace(workspaceIds[i], [], [testUser.email]));
    await Promise.all(promises);
    let testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid &&
            workspaceIds.every((id) => user.workspaceInvitationIds.includes(id))
        )
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime;

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
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
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
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Rejects the workspace invitation, when the user already belongs to some workspaces", async () => {
    const promises = [];
    for (let i = 1; i < workspaceIds.length; i++)
      promises.push(addUsersToWorkspace(workspaceIds[i], [testUser.uid]));
    promises.push(addUsersToWorkspace(workspaceIds[0], [], [testUser.email]));
    await Promise.all(promises);
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
    const oldModificationTime = testUserDoc!.modificationTime;

    await rejectWorkspaceInvitation(workspaceIds[0]);

    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toEqual(workspaceIds.slice(1));
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
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
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
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
            userDetails.hiddenWorkspaceInvitationIds.includes(workspaceIds[0])
        )
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime;

    await rejectWorkspaceInvitation(workspaceIds[0]);

    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
    const testUserDetailsDoc = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid && userDetails.hiddenWorkspaceInvitationIds.length == 0
        )
      )
    );
    expect(testUserDetailsDoc!.hiddenWorkspaceInvitationIds).toBeArrayOfSize(0);
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
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });
});
