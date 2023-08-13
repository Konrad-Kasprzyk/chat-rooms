import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersToWorkspace } from "__tests__/utils/addUsersToWorkspace.util";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { removeUsersFromWorkspace } from "__tests__/utils/removeUsersFromWorkspace.util";
import getCurrentUser from "client_api/user/getCurrentUser.api";
import getWorkspaceUsers from "client_api/user/getWorkspaceUsers.api";
import changeWorkspaceDescription from "client_api/workspace/changeWorkspaceDescription.api";
import changeWorkspaceTitle from "client_api/workspace/changeWorkspaceTitle.api";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import { Collections } from "db/client/firebase";
import { doc, getDoc, getDocs } from "firebase/firestore";
import path from "path";
import { BehaviorSubject, firstValueFrom, skipWhile } from "rxjs";

function checkIfWorkspaceUsersSubjectContainProvidedUsers(
  workspaceUsersSubject: BehaviorSubject<User[]>,
  expectedUsers: User[],
  expectedWorkspace: { id: string; url: string; title: string; description: string } | null
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
    expect(workspace!.url).toEqual(expectedWorkspace!.url);
    expect(workspace!.title).toEqual(expectedWorkspace!.title);
    expect(workspace!.description).toEqual(expectedWorkspace!.description);
  }
}

async function getAllTestUsers(): Promise<User[]> {
  // Instead of taking all users, make filter to take users from same workspace, to pass firestore rules
  const allUsersQuery = Collections.users.orderBy("id");
  const querySnapshot = await getDocs(allUsersQuery);
  return querySnapshot.docs.map((doc) => doc.data());
}

let testWorkspace: Workspace;
let testWorkspaceId: string;
let testUserIds: string[];

/**
 * This function updates the workspace with the latest data from the database.
 */
async function getAndUpdateTestWorkspace() {
  const workspaceRef = doc(Collections.workspaces, testWorkspaceId);
  const workspace = (await getDoc(workspaceRef)).data();
  if (!workspace) throw "Could not get the workspace from the database.";
  testWorkspace = workspace;
  return workspace;
}

describe("Test client api returning subject listening workspace users.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
    testUserIds = (await registerAndCreateTestUserDocuments(5)).map((user) => user.id);
    testUserIds.sort();
    await signInTestUser(testUserIds[0]);
    await firstValueFrom(
      getCurrentUser().pipe(skipWhile((user) => !user || user.id !== testUserIds[0]))
    );
    const filename = path.parse(__filename).name;
    testWorkspaceId = await createTestEmptyWorkspace(filename);
    await getAndUpdateTestWorkspace();
  });
  // Synchronize the test workspace with the the database document and
  // assure that the first test user belongs to the testing workspace.
  beforeEach(async () => {
    await getAndUpdateTestWorkspace();
    if (!testWorkspace.userIds.includes(testUserIds[0])) {
      await addUsersToWorkspace([testUserIds[0]], testWorkspace.id);
      await getAndUpdateTestWorkspace();
    }
  });

  it("Subject returns a single user, when the workspace contains only one user", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await removeUsersFromWorkspace(testUserIds, testWorkspace.id);
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));
    await addUsersToWorkspace([testUserIds[0]], testWorkspace.id);
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

    await removeUsersFromWorkspace(testUserIds, testWorkspace.id);
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));

    expect(workspaceUsersSubject.value).toBeArrayOfSize(0);
  });

  // TODO check if this test passes when firestore rules are implemented
  it.skip("Subject returns array of users, when the current user is removed from and added to the workspace", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await addUsersToWorkspace(testUserIds, testWorkspace.id);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await removeUsersFromWorkspace([testUserIds[0]], testWorkspace.id);
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));
    await addUsersToWorkspace([testUserIds[0]], testWorkspace.id);
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

    await addUsersToWorkspace(testUserIds, testWorkspace.id);
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

    await addUsersToWorkspace(testUserIds, testWorkspace.id);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await changeWorkspaceTitle(testWorkspace.id, newTitle);
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

    await addUsersToWorkspace(testUserIds, testWorkspace.id);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await changeWorkspaceDescription(testWorkspace.id, newDescription);
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

    await addUsersToWorkspace(testUserIds, testWorkspace.id);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await removeUsersFromWorkspace([testUserIds[0]], testWorkspace.id);
    await firstValueFrom(workspaceUsersSubject.pipe(skipWhile((users) => users.length !== 0)));

    expect(workspaceUsersSubject.value).toBeArrayOfSize(0);
  });

  it("Subject returns all the users belonging to the workspace, when an user is removed from the workspace", async () => {
    const workspaceUsersSubject = getWorkspaceUsers(testWorkspace.id);

    await addUsersToWorkspace(testUserIds, testWorkspace.id);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length))
    );
    await removeUsersFromWorkspace([testUserIds.at(-1)!], testWorkspace.id);
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

    await addUsersToWorkspace(testUserIds.slice(0, -1), testWorkspace.id);
    await removeUsersFromWorkspace([testUserIds.at(-1)!], testWorkspace.id);
    await firstValueFrom(
      workspaceUsersSubject.pipe(skipWhile((users) => users.length !== testUserIds.length - 1))
    );
    await addUsersToWorkspace([testUserIds.at(-1)!], testWorkspace.id);
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
