import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersToWorkspace } from "__tests__/utils/addUsersToWorkspace.util";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import uncoverWorkspaceInvitation from "client_api/user/uncoverWorkspaceInvitation.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of uncovering a workspace invitation.", () => {
  let workspaceCreatorId: string;
  let workspaceId: string;

  /**
   * Creates the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  it("The document of the user using the api not found.", async () => {
    expect.assertions(1);
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    await expect(uncoverWorkspaceInvitation("foo")).rejects.toThrow("User document not found.");
  });

  it("The user is not invited to the workspace.", async () => {
    expect.assertions(1);
    const user = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(user.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((u) => u?.id == user.uid)));

    await expect(uncoverWorkspaceInvitation("foo")).rejects.toThrow(
      "The user is not invited to the workspace with id foo"
    );
  });

  it("The user details document of the user using the api not found.", async () => {
    expect.assertions(1);
    const user = (await registerAndCreateTestUserDocuments(1))[0];
    await addUsersToWorkspace(workspaceId, [], [user.email]);
    await signInTestUser(user.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((u) => u?.id == user.uid && u.workspaceInvitationIds.includes(workspaceId))
      )
    );
    await adminCollections.userDetails.doc(user.uid).delete();
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails == null))
    );

    await expect(uncoverWorkspaceInvitation(workspaceId)).rejects.toThrow(
      "User details document not found."
    );
  });

  it("The workspace is not hidden.", async () => {
    expect.assertions(1);
    const user = (await registerAndCreateTestUserDocuments(1))[0];
    await addUsersToWorkspace(workspaceId, [], [user.email]);
    await signInTestUser(user.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((u) => u?.id == user.uid && u.workspaceInvitationIds.includes(workspaceId))
      )
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == user.uid))
    );

    await expect(uncoverWorkspaceInvitation(workspaceId)).rejects.toThrow(
      `The workspace with id ${workspaceId} is not hidden.`
    );
  });
});
