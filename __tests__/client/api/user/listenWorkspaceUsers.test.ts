import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import LONG_BEFORE_EACH_TIMEOUT from "__tests__/constants/longBeforeEachTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import changeCurrentUserUsername from "clientApi/user/changeCurrentUserUsername.api";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import listenWorkspaceUsers, {
  _listenWorkspaceUsersExportedForTesting,
} from "clientApi/user/listenWorkspaceUsers.api";
import signOut from "clientApi/user/signOut.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "clientApi/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import auth from "common/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
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

describe("Test client api listening workspace users.", () => {
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

  it("Subject returns a single user, when the workspace contains only one user", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();

    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == 1))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual([testUserIds[0]]);
    expect(workspaceUsers.updates).toBeArrayOfSize(0);
  });

  // TODO check if this test passes when firestore rules are implemented.
  // It should return an error from subject when the current user leaves the workspace.
  it.skip(
    "Subject returns array of users, " +
      "when the current user is removed from and added to the workspace",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();
      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      await removeUsersFromWorkspace(testWorkspaceId, [testUserIds[0]]);
      await expect(firstValueFrom(workspaceUsersListener.pipe(filter(() => false)))).toReject();
      await addUsersToWorkspace(testWorkspaceId, [testUserIds[0]]);
      const workspaceUsers = await firstValueFrom(
        listenWorkspaceUsers().pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(workspaceUsers.updates).toBeArrayOfSize(0);
    }
  );

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when the workspace contains multiple users",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();

      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      const workspaceUsers = await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(workspaceUsers.updates.map((update) => [update.type, update.doc.id])).toEqual(
        testUserIds.slice(1).map((uid) => ["added", uid])
      );
    }
  );

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when the workspace contains multiple users and the subject is retrieved again from the function.",
    async () => {
      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      const workspaceUsers = await firstValueFrom(
        listenWorkspaceUsers().pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      const newerUsers = await firstValueFrom(listenWorkspaceUsers());

      expect(newerUsers.docs).toEqual(workspaceUsers.docs);
      expect(newerUsers.updates).toBeArrayOfSize(0);
    }
  );

  it(
    "Subject returns all the users belonging to the workspace without previous updates, " +
      "when the subject is retrieved again from the function.",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();
      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      let workspaceUsers = await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );
      expect(workspaceUsers.updates).toBeArrayOfSize(testUserIds.length - 1);

      workspaceUsers = await firstValueFrom(listenWorkspaceUsers());

      expect(workspaceUsers.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns an empty array, when no workspace is open", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();

    setOpenWorkspaceId(null);
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == 0))
    );

    expect(workspaceUsers.docs).toBeArrayOfSize(0);
    expect(workspaceUsers.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns an empty array, " +
      "when no workspace is open and subject returned previously multiple users",
    async () => {
      let workspaceUsersListener = listenWorkspaceUsers();
      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      setOpenWorkspaceId(null);
      const workspaceUsers = await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == 0))
      );

      expect(workspaceUsers.docs).toBeArrayOfSize(0);
      expect(workspaceUsers.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns all the users belonging to the workspace, when the workspace is reopen", async () => {
    let workspaceUsersListener = listenWorkspaceUsers();
    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );

    setOpenWorkspaceId(null);
    await firstValueFrom(workspaceUsersListener.pipe(filter((users) => users.docs.length == 0)));
    setOpenWorkspaceId(testWorkspaceId);
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(workspaceUsers.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when opening different workspace",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();
      const filename = path.parse(__filename).name;
      const secondTestWorkspaceId = await createTestWorkspace(filename);
      await addUsersToWorkspace(secondTestWorkspaceId, testUserIds);

      setOpenWorkspaceId(secondTestWorkspaceId);
      const workspaceUsers = await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(workspaceUsers.updates).toBeArrayOfSize(0);
      await checkWorkspace(secondTestWorkspaceId);
    }
  );

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when changing open workspace first to null and then to different open workspace",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();
      const filename = path.parse(__filename).name;
      const secondTestWorkspaceId = await createTestWorkspace(filename);
      await addUsersToWorkspace(secondTestWorkspaceId, testUserIds);

      setOpenWorkspaceId(null);
      await firstValueFrom(workspaceUsersListener.pipe(filter((users) => users.docs.length == 0)));
      setOpenWorkspaceId(secondTestWorkspaceId);
      const workspaceUsers = await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(workspaceUsers.updates).toBeArrayOfSize(0);
      await checkWorkspace(secondTestWorkspaceId);
    }
  );

  it("Subject returns an empty array, when the user signs out", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();

    signOut();
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == 0))
    );

    expect(workspaceUsers.docs).toBeArrayOfSize(0);
    expect(workspaceUsers.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when the current user signs out and signs in",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();

      signOut();
      await firstValueFrom(workspaceUsersListener.pipe(filter((users) => users.docs.length == 0)));
      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      signInTestUser(testUserIds[0]);
      setOpenWorkspaceId(testWorkspaceId);
      const workspaceUsers = await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(workspaceUsers.updates).toBeArrayOfSize(0);
    }
  );

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when the current user signs out and the different user signs in",
    async () => {
      const workspaceUsersListener = listenWorkspaceUsers();

      signOut();
      await firstValueFrom(workspaceUsersListener.pipe(filter((users) => users.docs.length == 0)));
      await addUsersToWorkspace(testWorkspaceId, testUserIds);
      // TODO why at(-1) works, when there is no polyfill and target is ES2020?
      signInTestUser(testUserIds.at(-1)!);
      setOpenWorkspaceId(testWorkspaceId);
      const workspaceUsers = await firstValueFrom(
        workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
      );

      expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(workspaceUsers.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns proper updates, when an other user is removed from the workspace", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();
    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );

    // TODO why at(-1) works, when there is no polyfill and target is ES2020?
    await removeUsersFromWorkspace(testWorkspaceId, [testUserIds.at(-1)!]);
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length - 1))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds.slice(0, -1));
    expect(workspaceUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["removed", testUserIds.at(-1)],
    ]);
  });

  it("Subject returns proper updates, when an other user is marked as deleted.", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();
    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );

    // TODO why at(-1) works, when there is no polyfill and target is ES2020?
    await Promise.all([
      adminCollections.users
        .doc(testUserIds.at(-1)!)
        .update({ isDeleted: true, modificationTime: FieldValue.serverTimestamp() }),
      adminCollections.userDetails.doc(testUserIds.at(-1)!).update({ isDeleted: true }),
    ]);
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length - 1))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds.slice(0, -1));
    expect(workspaceUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["removed", testUserIds.at(-1)],
    ]);
    // TODO why at(-1) works, when there is no polyfill and target is ES2020?
    await Promise.all([
      adminCollections.users
        .doc(testUserIds.at(-1)!)
        .update({ isDeleted: false, modificationTime: FieldValue.serverTimestamp() }),
      adminCollections.userDetails.doc(testUserIds.at(-1)!).update({ isDeleted: false }),
    ]);
  });

  it("Subject returns proper updates, when an other user is added to the workspace", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();

    await addUsersToWorkspace(testWorkspaceId, [testUserIds[1]]);
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == 2))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds.slice(0, 2));
    expect(workspaceUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["added", testUserIds[1]],
    ]);
  });

  // TODO why at(-1) works, when there is no polyfill and target is ES2020?
  it("Subject returns proper updates, when an other user changes username", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();
    const newUsername = new Date().toISOString();
    const changedUserId = testUsers.at(-1)!.uid;

    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );
    await adminCollections.users.doc(testUserIds.at(-1)!).update({
      username: newUsername,
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    testUsers.at(-1)!.displayName = newUsername;
    sortTestUsers();
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.updates.length == 1))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(workspaceUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["modified", changedUserId],
    ]);
    expect(workspaceUsers.updates[0].doc.username).toEqual(newUsername);
  });

  it("Subject returns proper updates, when the current user changes username", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();
    const newUsername = new Date().toISOString();
    const changedUserId = testUsers[0].uid;

    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );
    await changeCurrentUserUsername(newUsername);
    testUsers[0].displayName = newUsername;
    sortTestUsers();
    const workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.updates.length == 1))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(workspaceUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["modified", changedUserId],
    ]);
    expect(workspaceUsers.updates[0].doc.username).toEqual(newUsername);
  });

  it("After an error and function re-call, the subject returns the workspace users.", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();
    if (!_listenWorkspaceUsersExportedForTesting)
      throw new Error("listenWorkspaceUsers.api module didn't export functions for testing.");

    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );
    _listenWorkspaceUsersExportedForTesting.setSubjectError();
    await expect(firstValueFrom(workspaceUsersListener)).toReject();
    const workspaceUsers = await firstValueFrom(
      listenWorkspaceUsers().pipe(filter((users) => users.docs.length == testUserIds.length))
    );

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(workspaceUsers.updates).toBeArrayOfSize(0);
  });

  it("The subject returns all the workspace users, when the open workspace is in the recycle bin", async () => {
    const workspaceUsersListener = listenWorkspaceUsers();
    await addUsersToWorkspace(testWorkspaceId, testUserIds);
    let workspaceUsers = await firstValueFrom(
      workspaceUsersListener.pipe(filter((users) => users.docs.length == testUserIds.length))
    );
    const oldUpdates = workspaceUsers.updates;

    await moveWorkspaceToRecycleBin();
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
    // Make sure that the workspace user's listener would receive an update
    // when the workspace is put into the recycle bin.
    await new Promise((f) => setTimeout(f, 1000));
    workspaceUsers = await firstValueFrom(workspaceUsersListener);

    expect(workspaceUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    // The listener should not receive new updates as only the workspace changes,
    // not the workspace ids inside the user's documents.
    expect(workspaceUsers.updates).toEqual(oldUpdates);
  });
});
