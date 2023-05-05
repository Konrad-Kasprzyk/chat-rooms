import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../db/firebase";
import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../constants/collections";
import TestUsersAndSubcollections from "../../models/utils_models/testUsersAndSubcollections.model";

export default async function getTestUsers() {
  const testCollectionsId = process.env.TEST_COLLECTIONS_ID;
  if (!testCollectionsId)
    throw (
      "process.env.TEST_COLLECTIONS_ID is undefined. " +
      "Environment variable should be set in tests framework config, before global setup is run. " +
      "Cannot run tests on production collections."
    );
  const testCollectionsRef = adminDb
    .collection(COLLECTIONS.TestUsersAndSubcollections)
    .doc(testCollectionsId);
  const testCollectionsSnap = await testCollectionsRef.get();
  if (!testCollectionsSnap.exists) throw "Test collections document not found.";
  const testUsers = testCollectionsSnap.data() as TestUsersAndSubcollections;
  return testUsers;
}

export function getRegisteredOnlyUser(testUsers: TestUsersAndSubcollections) {
  return testUsers.registeredOnlyUsers[0];
}

export function signInTestUser(testUsers: TestUsersAndSubcollections) {
  return signInTestUserByIndex(testUsers, 0);
}

export function signInSecondTestUser(testUsers: TestUsersAndSubcollections) {
  return signInTestUserByIndex(testUsers, 1);
}

export function signInThirdTestUser(testUsers: TestUsersAndSubcollections) {
  return signInTestUserByIndex(testUsers, 2);
}

async function signInTestUserByIndex(testUsers: TestUsersAndSubcollections, index: number) {
  const testUser = testUsers.createdUsers[index];
  if (auth.currentUser) {
    if (
      auth.currentUser.uid === testUser.uid &&
      auth.currentUser.email === testUser.email &&
      auth.currentUser.displayName === testUser.username
    )
      return testUser;
    await auth.signOut();
  }
  await signInWithEmailAndPassword(auth, testUser.email, testUser.password);
  return testUser;
}
