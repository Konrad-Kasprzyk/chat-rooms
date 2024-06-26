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
import uncoverWorkspaceInvitation from "client/api/user/uncoverWorkspaceInvitation.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api uncovering a hidden workspace invitation.", () => {
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
   * Creates test workspaces.
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
   * Every test creates and signs in a new user to test uncovering a hidden workspace invitation.
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

  it("Properly uncovers a hidden workspace invitation, when no other invitation is hidden", async () => {
    await addUsersToWorkspace(workspaceIds[0], [], [testUser.email]);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid && user.workspaceInvitationIds.includes(workspaceIds[0])
        )
      )
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

    await uncoverWorkspaceInvitation(workspaceIds[0]);

    const testUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid && userDetails.hiddenWorkspaceInvitationIds.length == 0
        )
      )
    );
    expect(testUserDetails!.hiddenWorkspaceInvitationIds).toBeArrayOfSize(0);
  });

  it("Properly uncovers a hidden workspace invitation, when other invitations are hidden", async () => {
    const promises = [];
    for (let i = 0; i < workspaceIds.length; i++)
      promises.push(addUsersToWorkspace(workspaceIds[i], [], [testUser.email]));
    await Promise.all(promises);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid && user.workspaceInvitationIds.length == workspaceIds.length
        )
      )
    );
    for (let i = 0; i < workspaceIds.length; i++) await hideWorkspaceInvitation(workspaceIds[i]);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            workspaceIds.every((id) => userDetails.hiddenWorkspaceInvitationIds.includes(id))
        )
      )
    );

    await uncoverWorkspaceInvitation(workspaceIds[0]);

    const testUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationIds.length == workspaceIds.length - 1
        )
      )
    );
    expect(testUserDetails!.hiddenWorkspaceInvitationIds).toEqual(workspaceIds.slice(1));
  });
});
