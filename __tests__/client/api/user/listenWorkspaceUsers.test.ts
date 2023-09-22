import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersToWorkspace } from "__tests__/utils/addUsersToWorkspace.util";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { removeUsersFromWorkspace } from "__tests__/utils/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import { _listenWorkspaceUsersChangesExportedForTesting } from "client_api/user/_listenWorkspaceUsersChanges.util";
import changeCurrentUserUsername from "client_api/user/changeCurrentUserUsername.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenWorkspaceUsers from "client_api/user/listenWorkspaceUsers.api";
import signOut from "client_api/user/signOut.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import auth from "common/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { firstValueFrom, skipWhile } from "rxjs";

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

describe("Test client api returning subject listening workspace users.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
    testUsers = await registerAndCreateTestUserDocuments(5);
    sortTestUsers();
    await signInTestUser(testUserIds[0]);
    await firstValueFrom(listenCurrentUser().pipe(skipWhile((user) => !user)));
    const filename = path.parse(__filename).name;
    testWorkspaceId = await createTestEmptyWorkspace(filename);
  });
  /**
   * Sort test users by username, sign in the first test user and open the testing workspace.
   * Assure that only the first test user belongs to the testing workspace.
   */
  beforeEach(async () => {
    sortTestUsers();
    if (!auth.currentUser || auth.currentUser.uid !== testUserIds[0])
      await signInTestUser(testUserIds[0]);
    setOpenWorkspaceId(testWorkspaceId);
    await removeUsersFromWorkspace(testUserIds.slice(1), testWorkspaceId);
    await addUsersToWorkspace([testUserIds[0]], testWorkspaceId);
    await firstValueFrom(
      listenWorkspaceUsers().pipe(
        skipWhile((users) => users.docs.length !== 1 || users.docs[0].id !== testUserIds[0])
      )
    );
  });

  // TODO check if this test passes when firestore rules are implemented.
  // It should return an error from subject when user leaves the workspace.
  it.skip("Subject returns an error, when no user belongs to the workspace", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();

    await removeUsersFromWorkspace(testUserIds, testWorkspaceId);

    await expect(firstValueFrom(workspaceUsersSubject)).toReject();
  });

  // TODO check if this test passes when firestore rules are implemented
  it.skip(
    "Subject returns an error, when the current user doesn't belong to the workspace, " +
      "but the workspace contains other users.",
    async () => {
      const workspaceUsersSubject = listenWorkspaceUsers();

      await addUsersToWorkspace(testUserIds, testWorkspaceId);
      await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
      );
      await removeUsersFromWorkspace(testUserIds, testWorkspaceId);

      await expect(firstValueFrom(workspaceUsersSubject)).toReject();
    }
  );

  it("Subject returns a single user, when the workspace contains only one user", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();

    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 1))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual([testUserIds[0]]);
    expect(newUsers.updates).toBeArrayOfSize(0);
  });

  // TODO check if this test passes when firestore rules are implemented.
  // It should return an error from subject when user leaves the workspace.
  it.skip(
    "Subject returns array of users, " +
      "when the current user is removed from and added to the workspace",
    async () => {
      const workspaceUsersSubject = listenWorkspaceUsers();

      await addUsersToWorkspace(testUserIds, testWorkspaceId);
      await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
      );
      await removeUsersFromWorkspace([testUserIds[0]], testWorkspaceId);
      await expect(firstValueFrom(workspaceUsersSubject)).toReject();
      await addUsersToWorkspace([testUserIds[0]], testWorkspaceId);
      const newUsers = await firstValueFrom(listenWorkspaceUsers());

      expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(newUsers.updates).toBeArrayOfSize(0);
    }
  );

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when the workspace contains multiple users",
    async () => {
      const workspaceUsersSubject = listenWorkspaceUsers();

      await addUsersToWorkspace(testUserIds, testWorkspaceId);
      const newUsers = await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
      );

      expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(newUsers.updates.map((update) => [update.type, update.doc.id])).toEqual(
        testUserIds.slice(1).map((uid) => ["added", uid])
      );
    }
  );

  it("Subject returns an empty array, when no workspace is open", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();

    setOpenWorkspaceId(null);
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 0))
    );

    expect(newUsers.docs).toBeArrayOfSize(0);
    expect(newUsers.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns an empty array, " +
      "when no workspace is open and subject returned previously multiple users",
    async () => {
      let workspaceUsersSubject = listenWorkspaceUsers();
      await addUsersToWorkspace(testUserIds, testWorkspaceId);
      await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
      );

      workspaceUsersSubject = listenWorkspaceUsers();
      setOpenWorkspaceId(null);
      const newUsers = await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 0))
      );

      expect(newUsers.docs).toBeArrayOfSize(0);
      expect(newUsers.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns all the users belonging to the workspace, when the workspace is reopen", async () => {
    let workspaceUsersSubject = listenWorkspaceUsers();
    await addUsersToWorkspace(testUserIds, testWorkspaceId);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );
    setOpenWorkspaceId(null);
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 0)));

    workspaceUsersSubject = listenWorkspaceUsers();
    setOpenWorkspaceId(testWorkspaceId);
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(newUsers.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when different workspace is open",
    async () => {
      const workspaceUsersSubject = listenWorkspaceUsers();
      const filename = path.parse(__filename).name;
      const secondTestWorkspaceId = await createTestEmptyWorkspace(filename);
      await addUsersToWorkspace(testUserIds, secondTestWorkspaceId);

      setOpenWorkspaceId(secondTestWorkspaceId);
      const newUsers = await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
      );

      expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(newUsers.updates).toBeArrayOfSize(0);
    }
  );

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when changing open workspace first to null and then to different open workspace",
    async () => {
      const workspaceUsersSubject = listenWorkspaceUsers();
      const filename = path.parse(__filename).name;
      const secondTestWorkspaceId = await createTestEmptyWorkspace(filename);
      await addUsersToWorkspace(testUserIds, secondTestWorkspaceId);

      setOpenWorkspaceId(null);
      await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 0))
      );
      setOpenWorkspaceId(secondTestWorkspaceId);
      const newUsers = await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
      );

      expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(newUsers.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns an empty array, when the user signs out", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();

    signOut();
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 0))
    );

    expect(newUsers.docs).toBeArrayOfSize(0);
    expect(newUsers.updates).toBeArrayOfSize(0);
  });

  it("Subject returns all the users belonging to the workspace, when the user signs out and in", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();

    signOut();
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 0)));
    await addUsersToWorkspace(testUserIds, testWorkspaceId);
    await signInTestUser(testUserIds[0]);
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(newUsers.updates).toBeArrayOfSize(0);
  });

  it(
    "Subject returns all the users belonging to the workspace, " +
      "when the user signs out and the different user signs in",
    async () => {
      const workspaceUsersSubject = listenWorkspaceUsers();

      signOut();
      await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 0))
      );
      await addUsersToWorkspace(testUserIds, testWorkspaceId);
      await signInTestUser(testUserIds.at(-1)!);
      const newUsers = await firstValueFrom(
        workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
      );

      expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
      expect(newUsers.updates).toBeArrayOfSize(0);
    }
  );

  it("Subject returns proper updates, when an other user is removed from the workspace", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();

    await addUsersToWorkspace(testUserIds, testWorkspaceId);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );
    // TODO why at(-1) works, when there is no polyfill and target is ES2020?
    await removeUsersFromWorkspace([testUserIds.at(-1)!], testWorkspaceId);
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length - 1))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds.slice(0, -1));
    expect(newUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["removed", testUserIds.at(-1)],
    ]);
  });

  it("Subject returns proper updates, when an other user is added to the workspace", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();

    await addUsersToWorkspace([testUserIds[1]], testWorkspaceId);
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== 2))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds.slice(0, 2));
    expect(newUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["added", testUserIds[1]],
    ]);
  });

  it("Subject returns proper updates, when an other user changes username", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();
    const newUsername = new Date().toISOString();
    const changedUserId = testUsers.at(-1)!.uid;

    await addUsersToWorkspace(testUserIds, testWorkspaceId);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );
    await adminCollections.users.doc(testUserIds.at(-1)!).update({
      username: newUsername,
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    testUsers.at(-1)!.displayName = newUsername;
    sortTestUsers();
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.updates.length !== 1))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(newUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["modified", changedUserId],
    ]);
    expect(newUsers.updates[0].doc.username).toEqual(newUsername);
  });

  it("Subject returns proper updates, when the current user changes username", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();
    const newUsername = new Date().toISOString();
    const changedUserId = testUsers[0].uid;

    await addUsersToWorkspace(testUserIds, testWorkspaceId);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );
    await changeCurrentUserUsername(newUsername);
    testUsers[0].displayName = newUsername;
    sortTestUsers();
    const newUsers = await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.updates.length !== 1))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(newUsers.updates.map((update) => [update.type, update.doc.id])).toEqual([
      ["modified", changedUserId],
    ]);
    expect(newUsers.updates[0].doc.username).toEqual(newUsername);
  });

  it("After an error and function re-call, the subject returns the workspace users.", async () => {
    const workspaceUsersSubject = listenWorkspaceUsers();
    if (!_listenWorkspaceUsersChangesExportedForTesting)
      throw new Error(
        "_listenWorkspaceUsersChanges.util module didn't export functions for testing."
      );

    await addUsersToWorkspace(testUserIds, testWorkspaceId);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );
    _listenWorkspaceUsersChangesExportedForTesting.setSubjectError();
    await expect(firstValueFrom(workspaceUsersSubject)).toReject();
    const newUsers = await firstValueFrom(
      listenWorkspaceUsers().pipe(skipWhile((users) => users.docs.length !== testUserIds.length))
    );

    expect(newUsers.docs.map((user) => user.id)).toEqual(testUserIds);
    expect(newUsers.updates).toBeArrayOfSize(0);
  });

  //TODO
  it.skip("The subject returns all the workspace users, when the cache is empty", async () => {});

  //TODO
  it.skip(
    "The subject returns all the workspace users, " +
      "when the cache is partially synchronized with firestore (stale)",
    async () => {}
  );

  //TODO
  it.skip(
    "The subject returns all the workspace users, " +
      "when the cache is fully synchronized with firestore (up to date)",
    async () => {}
  );
});
