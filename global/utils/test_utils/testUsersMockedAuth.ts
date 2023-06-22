import { adminDb } from "db/firebase-admin";
import COLLECTIONS from "global/constants/collections";
import User from "global/models/user.model";
import { v4 as uuidv4 } from "uuid";
import createUserModel from "../admin_utils/createUserModel";
import testCollectionsId from "./testCollectionsId";

class MockedFirebaseUser {
  constructor(
    public uid: string,
    public email: string,
    public displayName: string,
    public emailVerified: boolean = true
  ) {}

  async delete(): Promise<void> {
    const thisUserIndex = registeredMockUsers.findIndex((user) => user.uid === this.uid);
    if (thisUserIndex > -1) registeredMockUsers.splice(thisUserIndex, 1);
    mockedAuth.currentUser = null;
  }
}

class MockedFirebaseAuth {
  constructor(public currentUser: MockedFirebaseUser | null) {}
  signOut() {
    this.currentUser = null;
  }
}

const mockedAuth: MockedFirebaseAuth = new MockedFirebaseAuth(null);
const registeredMockUsers: MockedFirebaseUser[] = [];

export async function signInTestUser(
  uid: string
): Promise<{ uid: string; email: string; displayName: string }> {
  const user = registeredMockUsers.find((user) => user.uid == uid);
  if (!user) throw `Couldn't find the test user with uid ${uid}`;
  if (!testCollectionsId) throw "testCollectionsId is not a non-empty string.";
  await adminDb
    .collection(COLLECTIONS.testCollections)
    .doc(testCollectionsId)
    .update({ signedInTestUserId: user.uid });
  mockedAuth.currentUser = new MockedFirebaseUser(user.uid, user.email, user.displayName);
  return mockedAuth.currentUser;
}

export async function registerAndCreateTestUserDocuments(howMany: number): Promise<User[]> {
  const registeredTestUsers = registerTestUsers(howMany);
  const createdUserModels: User[] = [];
  for (const user of registeredTestUsers)
    createdUserModels.push(
      await createUserModel(user.uid, user.displayName, user.email, COLLECTIONS)
    );
  return createdUserModels;
}

export function getAllRegisteredTestUsers(): {
  uid: string;
  email: string;
  displayName: string;
}[] {
  return registeredMockUsers;
}

export function registerTestUsers(howMany: number): {
  uid: string;
  email: string;
  displayName: string;
}[] {
  const newRegisteredTestUsers = [];
  for (let i = 0; i < howMany; i++) {
    const uid = uuidv4();
    const email = uid + "@normkeeper-testing.api";
    const displayName = `Testing user ${i}`;
    newRegisteredTestUsers.push(new MockedFirebaseUser(uid, email, displayName));
  }
  registeredMockUsers.push(...newRegisteredTestUsers);
  return newRegisteredTestUsers;
}

export { mockedAuth };
