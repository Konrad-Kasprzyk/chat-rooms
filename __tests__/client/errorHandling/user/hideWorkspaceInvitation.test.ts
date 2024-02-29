import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserDetailsDocumentNotFoundError from "__tests__/utils/commonTests/clientErrors/testUserDetailsDocumentNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import hideWorkspaceInvitation from "client/api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of hiding a workspace invitation.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user details document of the user using the api not found.", async () => {
    await testUserDetailsDocumentNotFoundError(() => hideWorkspaceInvitation("foo"));
  });

  it("The user is not invited to the workspace.", async () => {
    expect.assertions(1);
    const user = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(user.uid);
    await firstValueFrom(listenCurrentUserDetails().pipe(filter((u) => u?.id == user.uid)));

    await expect(hideWorkspaceInvitation("foo")).rejects.toThrow(
      "The user is not invited to the workspace with id foo"
    );
  });

  it("The workspace is hidden already.", async () => {
    expect.assertions(1);
    const workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((u) => u?.id == testUser.uid && u.workspaceInvitationIds.includes(workspaceId))
      )
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );

    await hideWorkspaceInvitation(workspaceId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationIds.includes(workspaceId)
        )
      )
    );

    await expect(hideWorkspaceInvitation(workspaceId)).rejects.toThrow(
      `The workspace with id ${workspaceId} is hidden already.`
    );
  });
});
