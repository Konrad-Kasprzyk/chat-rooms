import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDocs/checkUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestEmptyWorkspace from "__tests__/utils/workspace/createTestEmptyWorkspace.util";
import hideWorkspaceInvitation from "client_api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import uncoverWorkspaceInvitation from "client_api/user/uncoverWorkspaceInvitation.api";
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
    for (let i = 0; i < 3; i++) workspaceIds.push(await createTestEmptyWorkspace(filename));
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
            userDetails.hiddenWorkspaceInvitationsIds.includes(workspaceIds[0])
        )
      )
    );

    await uncoverWorkspaceInvitation(workspaceIds[0]);

    const testUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid && userDetails.hiddenWorkspaceInvitationsIds.length == 0
        )
      )
    );
    expect(testUserDetails!.hiddenWorkspaceInvitationsIds).toBeArrayOfSize(0);
  });

  it("Properly uncovers a hidden workspace invitation, when other invitations are hidden", async () => {
    for (let i = 0; i < workspaceIds.length; i++)
      await addUsersToWorkspace(workspaceIds[i], [], [testUser.email]);
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
            workspaceIds.every((id) => userDetails.hiddenWorkspaceInvitationsIds.includes(id))
        )
      )
    );

    await uncoverWorkspaceInvitation(workspaceIds[0]);

    const testUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationsIds.length == workspaceIds.length - 1
        )
      )
    );
    expect(testUserDetails!.hiddenWorkspaceInvitationsIds).toEqual(workspaceIds.slice(1));
  });
});
