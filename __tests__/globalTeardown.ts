import { adminAuth, adminDb } from "../db/firebase-admin";
import COLLECTIONS from "../global/constants/collections";
import getTestUsers from "../global/utils/test_utils/getTestUsers";

async function globalTeardown() {
  const testCollectionsId = process.env.TEST_COLLECTIONS_ID;
  if (!testCollectionsId)
    throw (
      "process.env.TEST_COLLECTIONS_ID is undefined. " +
      "Environment variable should be set in tests framework config, before global setup is run. " +
      "Cannot run tests on production collections."
    );
  await deleteRegisteredTestUsers();
  await deleteTestCollections(testCollectionsId);
}

/**
 * Delete registered users without deleting their documents. Their documents will
 * be deleted when deleting all test collections.
 */
async function deleteRegisteredTestUsers() {
  const testUsers = await getTestUsers();
  const userIds = [...testUsers.registeredOnlyUsers, ...testUsers.createdUsers].map(
    (user) => user.uid
  );
  const promises: Promise<any>[] = [];
  for (const uid of userIds) promises.push(adminAuth.deleteUser(uid));
  return Promise.all(promises);
}

function deleteTestCollections(testCollectionsId: string) {
  const testCollectionsRef = adminDb
    .collection(COLLECTIONS.TestUsersAndSubcollections)
    .doc(testCollectionsId);
  return adminDb.recursiveDelete(testCollectionsRef);
}

export default globalTeardown;
