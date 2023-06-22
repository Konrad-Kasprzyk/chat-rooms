import globalBeforeAll from "__tests__/globalBeforeAll";
import { getCurrentUser, getWorkspaceUsers } from "client_api/user.api";
import { db } from "db/firebase";
import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import COLLECTIONS from "global/constants/collections";
import User from "global/models/user.model";
import Workspace from "global/models/workspace.model";
import createTestEmptyWorkspace from "global/utils/test_utils/createTestEmptyWorkspace";
import {
  registerAndCreateTestUserDocuments,
  signInTestUser,
} from "global/utils/test_utils/testUsersMockedAuth";
import { addUsersToWorkspace, removeUsersFromWorkspace } from "global/utils/workspaceUsers";
import path from "path";
import { BehaviorSubject, firstValueFrom, skipWhile } from "rxjs";

function checkIfWorkspaceUsersSubjectContainProvidedUsers(
  workspaceUsersSubject: BehaviorSubject<User[]>,
  expectedUsers: User[],
  expectedWorkspace: { id: string; title: string; description: string } | null
) {
  expect(expectedWorkspace).not.toBeNull();
  expect(workspaceUsersSubject.value).toBeArrayOfSize(expectedUsers.length);
  for (const expectedUser of expectedUsers) {
    const user = workspaceUsersSubject.value.find((user) => user.id === expectedUser.id);
    expect(user).toBeDefined();
    expect(user!.email).toEqual(expectedUser.email);
    expect(user!.username).toEqual(expectedUser.username);
    const workspace = user!.workspaces.find((workspace) => workspace.id === expectedWorkspace!.id);
    expect(workspace).toBeDefined();
    expect(workspace!.title).toEqual(expectedWorkspace!.title);
    expect(workspace!.description).toEqual(expectedWorkspace!.description);
  }
}

async function getAllTestUsers(): Promise<User[]> {
  const allUsersQuery = query(collection(db, COLLECTIONS.users), orderBy("id"));
  const querySnapshot = await getDocs(allUsersQuery);
  return querySnapshot.docs.map((doc) => doc.data() as User);
}

let testWorkspace: Workspace;
let testUserIds: string[];

/**
 * This function updates the workspace with the latest data from the database.
 */
async function getAndUpdateTestWorkspace() {
  expect(testWorkspace).toBeDefined();
  expect(testWorkspace.id).toBeDefined();
  const workspaceSnap = await adminDb
    .collection(COLLECTIONS.workspaces)
    .doc(testWorkspace.id)
    .get();
  const updatedWorkspace = workspaceSnap.exists ? (workspaceSnap.data() as Workspace) : undefined;
  if (!updatedWorkspace) throw "Could not get the workspace from the database.";
  testWorkspace = updatedWorkspace;
  return updatedWorkspace;
}

describe("Test client api returning subject listening workspace users.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
    testUserIds = (await registerAndCreateTestUserDocuments(5)).map((user) => user.id);
    testUserIds.sort();
    const testUser = await signInTestUser(testUserIds[0]);
    const filename = path.parse(__filename).name;
    testWorkspace = await createTestEmptyWorkspace(testUser.uid, filename);
  });
  // Synchronize the test workspace with the the database document and
  // assure that the first test user belongs to the testing workspace.
  beforeEach(async () => {
    await getAndUpdateTestWorkspace();
    if (!testWorkspace.userIds.includes(testUserIds[0])) {
      await addUsersToWorkspace(
        [testUserIds[0]],
        testWorkspace.id,
        testWorkspace.title,
        testWorkspace.description
      );
      await getAndUpdateTestWorkspace();
    }
  });

  it("Subject returns a single user, when the workspace contains only one user", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await removeUsersFromWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));
    await addUsersToWorkspace(
      [testUserIds[0]],
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 1)));
    await firstValueFrom(
      getCurrentUser().pipe(
        skipWhile((user) => !user || !user.workspaceIds.includes(testWorkspace.id))
      )
    );

    checkIfWorkspaceUsersSubjectContainProvidedUsers(
      workspaceUsersSubject,
      [getCurrentUser().value!],
      await getAndUpdateTestWorkspace()
    );
  });

  it("Subject returns an empty array, when no user belongs to the workspace", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await removeUsersFromWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));

    expect(workspaceUsersSubject.value).toBeArrayOfSize(0);
  });

  // TODO check if this test passes when firestore rules are implemented
  it.skip("Subject returns array of users, when the current user is removed from and added to the workspace", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await addUsersToWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await removeUsersFromWorkspace(
      [testUserIds[0]],
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));
    await addUsersToWorkspace(
      [testUserIds[0]],
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );

    checkIfWorkspaceUsersSubjectContainProvidedUsers(
      workspaceUsersSubject,
      await getAllTestUsers(),
      await getAndUpdateTestWorkspace()
    );
  });

  it("Subject returns all the users belonging to the workspace, when the workspace contains multiple users", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await addUsersToWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );

    checkIfWorkspaceUsersSubjectContainProvidedUsers(
      workspaceUsersSubject,
      await getAllTestUsers(),
      await getAndUpdateTestWorkspace()
    );
  });

  it("Subject returns all the users belonging to the workspace, when the workspace changes title", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);
    const newTitle = "changed " + testWorkspace.title;

    await addUsersToWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    // TODO: Use function from client workspace api to change title
    const promises: Promise<any>[] = [];
    for (const userId of testUserIds) {
      promises.push(
        adminDb
          .collection(COLLECTIONS.users)
          .doc(userId)
          .update({
            workspaces: FieldValue.arrayRemove({
              id: testWorkspace.id,
              title: testWorkspace.title,
              description: testWorkspace.description,
            }),
          })
      );
      promises.push(
        adminDb
          .collection(COLLECTIONS.users)
          .doc(userId)
          .update({
            workspaces: FieldValue.arrayUnion({
              id: testWorkspace.id,
              title: newTitle,
              description: testWorkspace.description,
            }),
          })
      );
    }
    promises.push(
      adminDb.collection(COLLECTIONS.workspaces).doc(testWorkspace.id).update({ title: newTitle })
    );
    await Promise.all(promises);
    await firstValueFrom(
      workspaceUsersSubject.pipe(
        skipWhile(
          (users) =>
            users.length !== testUserIds.length ||
            !users.every((user) =>
              user.workspaces.some(
                (workspace) => workspace.id === testWorkspace.id && workspace.title === newTitle
              )
            )
        )
      )
    );

    checkIfWorkspaceUsersSubjectContainProvidedUsers(
      workspaceUsersSubject,
      await getAllTestUsers(),
      await getAndUpdateTestWorkspace()
    );
  });

  it("Subject returns all the users belonging to the workspace, when the workspace changes description", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);
    const newDescription = "changed " + testWorkspace.description;

    await addUsersToWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    // TODO: Use function from client workspace api to change description
    const promises: Promise<any>[] = [];
    for (const userId of testUserIds) {
      promises.push(
        adminDb
          .collection(COLLECTIONS.users)
          .doc(userId)
          .update({
            workspaces: FieldValue.arrayRemove({
              id: testWorkspace.id,
              title: testWorkspace.title,
              description: testWorkspace.description,
            }),
          })
      );
      promises.push(
        adminDb
          .collection(COLLECTIONS.users)
          .doc(userId)
          .update({
            workspaces: FieldValue.arrayUnion({
              id: testWorkspace.id,
              title: testWorkspace.title,
              description: newDescription,
            }),
          })
      );
    }
    promises.push(
      adminDb
        .collection(COLLECTIONS.workspaces)
        .doc(testWorkspace.id)
        .update({ description: newDescription })
    );
    await Promise.all(promises);
    await firstValueFrom(
      workspaceUsersSubject.pipe(
        skipWhile(
          (users) =>
            users.length !== testUserIds.length ||
            !users.every((user) =>
              user.workspaces.some(
                (workspace) =>
                  workspace.id === testWorkspace.id && workspace.description === newDescription
              )
            )
        )
      )
    );

    checkIfWorkspaceUsersSubjectContainProvidedUsers(
      workspaceUsersSubject,
      await getAllTestUsers(),
      await getAndUpdateTestWorkspace()
    );
  });

  // TODO check if this test passes when firestore rules are implemented
  it.skip("Subject returns an empty array, when the current user is removed from the workspace", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await addUsersToWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await removeUsersFromWorkspace(
      [testUserIds[0]],
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));

    expect(workspaceUsersSubject.value).toBeArrayOfSize(0);
  });

  it("Subject returns all the users belonging to the workspace, when an user is removed from the workspace", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await addUsersToWorkspace(
      testUserIds,
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await removeUsersFromWorkspace(
      [testUserIds.at(-1)!],
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length - 1))
    );

    checkIfWorkspaceUsersSubjectContainProvidedUsers(
      workspaceUsersSubject,
      (await getAllTestUsers()).slice(0, -1),
      await getAndUpdateTestWorkspace()
    );
  });

  it("Subject returns all the users belonging to the workspace, when an user is added to the workspace", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await addUsersToWorkspace(
      testUserIds.slice(0, -1),
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await removeUsersFromWorkspace(
      [testUserIds.at(-1)!],
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length - 1))
    );
    await addUsersToWorkspace(
      [testUserIds.at(-1)!],
      testWorkspace.id,
      testWorkspace.title,
      testWorkspace.description
    );
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );

    checkIfWorkspaceUsersSubjectContainProvidedUsers(
      workspaceUsersSubject,
      await getAllTestUsers(),
      await getAndUpdateTestWorkspace()
    );
  });
});
