import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testOpenWorkspaceNotFoundError from "__tests__/utils/commonTests/clientErrors/testOpenWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import cancelUserInvitationToWorkspace from "clientApi/workspace/cancelUserInvitationToWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of canceling a user invitation to a workspace.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The open workspace document not found.", async () => {
    await testOpenWorkspaceNotFoundError(() => cancelUserInvitationToWorkspace("foo"));
  });

  it("The user is not invited to the open workspace.", async () => {
    expect.assertions(1);
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    await expect(cancelUserInvitationToWorkspace("foo")).rejects.toThrow(
      `The user with email foo is not invited to the open workspace.`
    );
  });
});
