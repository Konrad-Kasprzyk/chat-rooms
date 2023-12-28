import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersToWorkspace } from "__tests__/utils/addUsersToWorkspace.util";
import checkUser from "__tests__/utils/checkDocs/checkUser.util";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import hideWorkspaceInvitation from "client_api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api hiding a workspace invitation.", () => {
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
      listenCurrentUser().pipe(filter((user) => user?.id == workspacesOwner.uid))
    );
    const filename = path.parse(__filename).name;
    for (let i = 0; i < 3; i++) workspaceIds.push(await createTestEmptyWorkspace(filename));
    workspaceIds.sort();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Every test creates and signs in a new user to test hiding a workspace invitation.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
  });

  afterEach(async () => {
    await checkUser(testUser.uid);
  });

  it("Hides a workspace invitation, when no other invitation is hidden", async () => {
    await addUsersToWorkspace(workspaceIds[0], [], [testUser.email]);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUser.uid && user.workspaceInvitationIds.includes(workspaceIds[0])
        )
      )
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );

    await hideWorkspaceInvitation(workspaceIds[0]);

    const testUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationsIds.includes(workspaceIds[0])
        )
      )
    );
    expect(testUserDetails?.hiddenWorkspaceInvitationsIds).toEqual([workspaceIds[0]]);
  });

  it("Hides a workspace invitation, when other invitations are hidden", async () => {
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
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    for (let i = 1; i < workspaceIds.length; i++) await hideWorkspaceInvitation(workspaceIds[i]);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            workspaceIds
              .slice(1)
              .every((id) => userDetails.hiddenWorkspaceInvitationsIds.includes(id))
        )
      )
    );

    await hideWorkspaceInvitation(workspaceIds[0]);

    const testUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationsIds.includes(workspaceIds[0])
        )
      )
    );
    expect(testUserDetails?.hiddenWorkspaceInvitationsIds).toEqual(workspaceIds);
  });
});
