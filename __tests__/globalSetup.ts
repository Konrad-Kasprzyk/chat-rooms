import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import { adminAuth, adminDb } from "../db/firebase-admin";
import COLLECTIONS from "../global/constants/collections";
import GLOBAL_COUNTER_ID from "../global/constants/globalCounterId";
import createUserModel from "../global/utils/admin_utils/createUserModel";

/**
 * This function sets up the global environment for testing by creating test collections, creating a
 * global counter for creating user documents, registering users and creating user documents.
 */
async function globalSetup() {
  const testCollectionsId = process.env.TEST_COLLECTIONS_ID;
  if (!testCollectionsId)
    throw (
      "process.env.TEST_COLLECTIONS_ID is undefined. " +
      "Environment variable should be set in tests framework config, before global setup is run. " +
      "Cannot run tests on production collections."
    );
  await createTestCollections(testCollectionsId);
  await createGlobalCounter();
  const userPromises: Promise<any>[] = [];
  const registeredOnlyUsersCount = 1;
  for (let i = 0; i < registeredOnlyUsersCount; i++)
    userPromises.push(registerUser(testCollectionsId));
  const createdUsersCount = 3;
  for (let i = 0; i < createdUsersCount; i++)
    userPromises.push(registerUserAndCreateUserDoc(testCollectionsId));
  await Promise.all(userPromises);
}

function createTestCollections(testCollectionsId: string) {
  return adminDb
    .collection(COLLECTIONS.TestUsersAndSubcollections)
    .doc(testCollectionsId)
    .create({ id: testCollectionsId, registeredOnlyUsers: [], createdUsers: [] });
}

function createGlobalCounter() {
  return adminDb
    .collection(COLLECTIONS.counters)
    .doc(GLOBAL_COUNTER_ID)
    .create({ nextUserShortId: " " });
}

async function registerUser(testCollectionsId: string) {
  const email = uuidv4() + "@normkeeper-testing.api";
  const password = uuidv4();
  const displayName = "Jeff";
  const uid = await adminAuth
    .createUser({
      email: email,
      emailVerified: true,
      password: password,
      displayName: displayName,
    })
    .then((userRecord) => userRecord.uid);
  const registeredUser = { uid, email, password, displayName };
  return adminDb
    .collection(COLLECTIONS.TestUsersAndSubcollections)
    .doc(testCollectionsId)
    .update({ registeredOnlyUsers: FieldValue.arrayUnion(registeredUser) });
}

async function registerUserAndCreateUserDoc(testCollectionsId: string) {
  const email = uuidv4() + "@normkeeper-testing.api";
  const password = uuidv4();
  const username = "Jeff ";
  const uid = await adminAuth
    .createUser({
      email: email,
      emailVerified: true,
      password: password,
      displayName: username,
    })
    .then((userRecord) => userRecord.uid);
  const createdUser = { uid, email, password, username };
  return Promise.all([
    createUserModel(uid, email, username),
    adminDb
      .collection(COLLECTIONS.TestUsersAndSubcollections)
      .doc(testCollectionsId)
      .update({ createdUsers: FieldValue.arrayUnion(createdUser) }),
  ]);
}

export default globalSetup;
