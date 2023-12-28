import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersToWorkspace } from "__tests__/utils/addUsersToWorkspace.util";
import checkUser from "__tests__/utils/checkDocs/checkUser.util";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import acceptWorkspaceInvitation from "client_api/user/acceptWorkspaceInvitation.api";
import hideWorkspaceInvitation from "client_api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api accepting the workspace invitation.", () => {
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
      listenCurrentUser().pipe(filter((user) => user?.id == workspacesOwner.uid))
    );
    const filename = path.parse(__filename).name;
    for (let i = 0; i < 3; i++) workspaceIds.push(await createTestEmptyWorkspace(filename));
    workspaceIds.sort();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Every test creates and signs in a new user to test accepting a workspace invitation.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
  });

  afterEach(async () => {
    await checkUser(testUser.uid);
  });

  it("Accepts the workspace invitation, when the user has only one invitation", async () => {
    await addUsersToWorkspace(workspaceIds[0], [], [testUser.email]);
    let testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 1)
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime.toMillis();

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    expect(testUserDoc?.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc?.workspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace?.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace?.userIds).toContain(testUser.uid);
    expect(belongingWorkspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Accepts the workspace invitation, when the user has multiple invitations", async () => {
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

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    expect(testUserDoc?.workspaceInvitationIds).toEqual(workspaceIds.slice(1));
    expect(testUserDoc?.workspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace?.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace?.userIds).toContain(testUser.uid);
    expect(belongingWorkspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Accepts the workspace invitation, when the user already belongs to some workspaces", async () => {
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

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    expect(testUserDoc?.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc?.workspaceIds).toEqual(workspaceIds);
    expect(testUserDoc?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace?.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace?.userIds).toContain(testUser.uid);
    expect(belongingWorkspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });

  it("Accepts a hidden workspace invitation", async () => {
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

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    expect(testUserDoc?.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc?.workspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    const testUserDetailsDoc = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid && userDetails.hiddenWorkspaceInvitationsIds.length == 0
        )
      )
    );
    expect(testUserDetailsDoc?.hiddenWorkspaceInvitationsIds).toBeArrayOfSize(0);
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace?.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace?.userIds).toContain(testUser.uid);
    expect(belongingWorkspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });
});
