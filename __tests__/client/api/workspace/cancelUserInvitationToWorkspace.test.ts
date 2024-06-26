import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import compareNewestUsersHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestUsersHistoryRecord.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import cancelUserInvitationToWorkspace from "client/api/workspace/cancelUserInvitationToWorkspace.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test cancelling a user's invitation to the workspace.", () => {
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
   * Each test creates a new user to invite. Signs in the workspaces owner.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
  });

  // All operations are performed on the first workspace, but just in case check also the last workspace.
  afterEach(async () => {
    await checkWorkspace(workspaceIds[0]);
    await checkWorkspace(workspaceIds[workspaceIds.length - 1]);
  });

  it("Cancels the workspace invitation, when the user has only one invitation", async () => {
    setOpenWorkspaceId(workspaceIds[0]);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceIds[0]))
    );
    await inviteUserToWorkspace(testUser.email);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );
    const oldModificationTime = workspace!.modificationTime;

    await cancelUserInvitationToWorkspace(testUser.email);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 0
        )
      )
    );
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await signInTestUser(testUser.uid);
    const testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toBeArrayOfSize(0);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "invitedUserEmails",
      userId: workspacesOwner.uid,
      date: testUserDoc!.modificationTime,
      oldValue: testUser.email,
      value: null,
    });
  });

  it("Cancels the workspace invitation, when the user has multiple invitations", async () => {
    const promises = [];
    for (let i = 0; i < workspaceIds.length; i++)
      promises.push(addUsersToWorkspace(workspaceIds[i], [], [testUser.email]));
    await Promise.all(promises);
    setOpenWorkspaceId(workspaceIds[0]);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );
    const oldModificationTime = workspace!.modificationTime;

    await cancelUserInvitationToWorkspace(testUser.email);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 0
        )
      )
    );
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await signInTestUser(testUser.uid);
    const testUserDoc = await firstValueFrom(
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
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "invitedUserEmails",
      userId: workspacesOwner.uid,
      date: testUserDoc!.modificationTime,
      oldValue: testUser.email,
      value: null,
    });
  });

  it("Cancels the workspace invitation, when the user already belongs to some workspaces", async () => {
    const promises = [];
    for (let i = 1; i < workspaceIds.length; i++)
      promises.push(addUsersToWorkspace(workspaceIds[i], [testUser.uid]));
    promises.push(addUsersToWorkspace(workspaceIds[0], [], [testUser.email]));
    await Promise.all(promises);
    setOpenWorkspaceId(workspaceIds[0]);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );
    const oldModificationTime = workspace!.modificationTime;

    await cancelUserInvitationToWorkspace(testUser.email);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceIds[0] && workspace.invitedUserEmails.length == 0
        )
      )
    );
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([workspacesOwner.uid]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await signInTestUser(testUser.uid);
    const testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceInvitationIds.length == 0)
      )
    );
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toEqual(workspaceIds.slice(1));
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "invitedUserEmails",
      userId: workspacesOwner.uid,
      date: testUserDoc!.modificationTime,
      oldValue: testUser.email,
      value: null,
    });
  });
});
