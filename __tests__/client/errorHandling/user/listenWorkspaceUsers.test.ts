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
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import listenWorkspaceUsers, {
  _listenWorkspaceUsersExportedForTesting,
} from "clientApi/user/listenWorkspaceUsers.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

let testWorkspaceId: string;
let testUserIds: string[];
let testUsers: {
  uid: string;
  email: string;
  displayName: string;
}[];

function sortTestUsers() {
  testUsers.sort((ws1, ws2) => {
    if (ws1.displayName < ws2.displayName) return -1;
    if (ws1.displayName === ws2.displayName) return 0;
    return 1;
  });
  testUserIds = testUsers.map((user) => user.uid);
}

describe("Test errors of listening the workspace users.", () => {
  /**
   * Creates the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    testUsers = await registerAndCreateTestUserDocuments(5);
    sortTestUsers();
    await signInTestUser(testUserIds[0]);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserIds[0]))
    );
    const filename = path.parse(__filename).name;
    testWorkspaceId = await createTestWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Sorts test users by username, signs in the first test user and opens the test workspace.
   * Assures that only the first test user belongs to the test workspace.
   */
  beforeEach(async () => {
    sortTestUsers();
    if (!auth.currentUser || auth.currentUser.uid !== testUserIds[0])
      await signInTestUser(testUserIds[0]);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserIds[0]))
    );
    const testUser = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUserIds[0] && !user.dataFromFirebaseAccount)
      )
    );
    if (!testUser!.workspaceIds.includes(testWorkspaceId))
      await addUsersToWorkspace(testWorkspaceId, [testUserIds[0]]);
    setOpenWorkspaceId(testWorkspaceId);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == testWorkspaceId))
    );
    const usersToRemoveFromWorkspace = workspace!.userIds.filter((uid) => uid != testUserIds[0]);
    const userEmailsToCancelInvitation = workspace!.invitedUserEmails;
    await removeUsersFromWorkspace(
      testWorkspaceId,
      usersToRemoveFromWorkspace,
      userEmailsToCancelInvitation
    );
    await firstValueFrom(
      listenWorkspaceUsers().pipe(
        filter((users) => users.docs.length == 1 && users.docs[0].id == testUserIds[0])
      )
    );
  }, LONG_BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    await checkWorkspace(testWorkspaceId);
  });

  it("After an error, the subject returns the updated workspace users.", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();
    await firstValueFrom(workspaceUsersListener.pipe(filter((users) => users.docs.length == 1)));
    if (!_listenWorkspaceUsersExportedForTesting)
      throw new Error("listenWorkspaceUsers.api module didn't export functions for testing.");

    _listenWorkspaceUsersExportedForTesting.setSubjectError();
    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(workspaceUsers.updates.every((update) => update.type == "added")).toBeTrue();
  });

  // TODO check if this test passes when firestore rules are implemented.
  // It should return an error from subject when user leaves the workspace.
  it.skip("Listener returns an error, when no user belongs to the workspace", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();

    await removeUsersFromWorkspace(testWorkspaceId, testUserIds);

    await expect(firstValueFrom(workspaceUsersListener.pipe(filter(() => false)))).toReject();
  });

  // TODO check if this test passes when firestore rules are implemented
  it.skip(
    "Subject returns an error, when the current user doesn't belong to the workspace, " +
      "but the workspace contains other users.",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();

      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );
      await removeUsersFromWorkspace(testWorkspaceId, [testUserIds[0]]);

      await expect(firstValueFrom(workspaceUsersListener.pipe(filter(() => false)))).toReject();
    }
  );
});
