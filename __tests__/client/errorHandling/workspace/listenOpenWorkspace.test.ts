import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import auth from "clientApi/db/auth.firebase";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import listenOpenWorkspace, {
  _listenOpenWorkspaceExportedForTesting,
} from "clientApi/workspace/listenOpenWorkspace.api";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of listening the open workspace document.", () => {
  let workspaceOwnerId: string;
  let workspaceId: string;
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let filename = path.parse(__filename).name;

  /**
   * Creates the test workspace and test users.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    workspaceOwnerId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
    workspaceId = await createTestWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the workspaces owner. Opens the test workspace.
   * Removes all other users from the workspace and cancels all invitations.
   * Checks that the test workspace is not in the recycle bin, marked as removed or removed.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid != workspaceOwnerId) {
      await signInTestUser(workspaceOwnerId);
      await firstValueFrom(
        listenCurrentUserDetails().pipe(
          filter((userDetails) => userDetails?.id == workspaceOwnerId)
        )
      );
    }
    if (getOpenWorkspaceId() != workspaceId) setOpenWorkspaceId(workspaceId);
    // If the workspace is in the recycle bin, marked as removed or removed, it will be null.
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const usersToRemoveFromWorkspace = workspace!.userIds.filter((uid) => uid != workspaceOwnerId);
    const userEmailsToCancelInvitation = workspace!.invitedUserEmails;
    await removeUsersFromWorkspace(
      workspaceId,
      usersToRemoveFromWorkspace,
      userEmailsToCancelInvitation
    );
  }, LONG_BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    await checkWorkspace(workspaceId);
  });

  it("After an error, the subject returns the updated workspace document.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 1)
      )
    );
    if (!_listenOpenWorkspaceExportedForTesting)
      throw new Error("listenOpenWorkspace.api module didn't export functions for testing.");

    _listenOpenWorkspaceExportedForTesting.setSubjectError();
    await addUsersToWorkspace(workspaceId, [testUser.uid]);
    const workspace = await firstValueFrom(
      openWorkspaceSubject.pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 2)
      )
    );

    expect(workspace).not.toBeNull();
  });

  // TODO check if this test passes when firestore rules are implemented.
  it.skip("Subject returns an error if the user does not belong to the workspace.", async () => {
    const openWorkspaceSubject = listenOpenWorkspace();
    await signInTestUser(testUser.uid);
    setOpenWorkspaceId(workspaceId);

    await expect(firstValueFrom(openWorkspaceSubject)).toReject();
  });
});
