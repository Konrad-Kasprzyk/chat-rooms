import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDTODocs/usableOrInBin/checkUser.util";
import compareNewestUsersHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestUsersHistoryRecord.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import acceptWorkspaceInvitation from "client/api/user/acceptWorkspaceInvitation.api";
import hideWorkspaceInvitation from "client/api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
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
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    for (let i = 0; i < 3; i++) workspaceIds.push(await createTestWorkspace(filename));
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
    const oldModificationTime = testUserDoc!.modificationTime;

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUser.uid).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace!.userIds).toContain(testUser.uid);
    expect(belongingWorkspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(belongingWorkspace!, {
      action: "users",
      userId: testUser.uid,
      date: testUserDoc!.modificationTime,
      oldValue: null,
      value: testUser.uid,
    });
  });

  it("Accepts the workspace invitation, when the user has multiple invitations", async () => {
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

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUser.uid).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc!.workspaceInvitationIds).toEqual(workspaceIds.slice(1));
    expect(testUserDoc!.workspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace!.userIds).toContain(testUser.uid);
    expect(belongingWorkspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(belongingWorkspace!, {
      action: "users",
      userId: testUser.uid,
      date: testUserDoc!.modificationTime,
      oldValue: null,
      value: testUser.uid,
    });
  });

  it("Accepts the workspace invitation, when the user already belongs to some workspaces", async () => {
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

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUser.uid).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds.sort()).toEqual(workspaceIds);
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toEqual(workspaceIds);
    expect(testUserDoc!.modificationTime).toBeAfter(oldModificationTime);
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace!.userIds).toContain(testUser.uid);
    expect(belongingWorkspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(belongingWorkspace!, {
      action: "users",
      userId: testUser.uid,
      date: testUserDoc!.modificationTime,
      oldValue: null,
      value: testUser.uid,
    });
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
            userDetails.hiddenWorkspaceInvitationIds.includes(workspaceIds[0])
        )
      )
    );
    const oldModificationTime = testUserDoc!.modificationTime;

    await acceptWorkspaceInvitation(workspaceIds[0]);
    testUserDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && user.workspaceIds.includes(workspaceIds[0]))
      )
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUser.uid).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceIds[0]]);
    expect(testUserDoc!.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(testUserDoc!.workspaceIds).toEqual([workspaceIds[0]]);
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
    setOpenWorkspaceId(workspaceIds[0]);
    const belongingWorkspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceIds[0] && workspace.userIds.includes(testUser.uid)
        )
      )
    );
    expect(belongingWorkspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(belongingWorkspace!.userIds).toContain(testUser.uid);
    expect(belongingWorkspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(belongingWorkspace!, {
      action: "users",
      userId: testUser.uid,
      date: testUserDoc!.modificationTime,
      oldValue: null,
      value: testUser.uid,
    });
  });
});
