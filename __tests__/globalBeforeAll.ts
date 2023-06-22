import { app } from "db/firebase";
import { adminDb } from "db/firebase-admin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import COLLECTIONS from "global/constants/collections";
import TestCollections from "global/models/utils_models/testCollections.model";
import createGlobalCounter from "global/utils/test_utils/createGlobalCounter";
import testCollectionsId from "global/utils/test_utils/testCollectionsId";

/**
 * This function creates the test collections document and global counter inside those test collections.
 * This function also signs in the main test user.
 */
export default async function globalBeforeAll() {
  const testsId = process.env.TESTS_ID;
  if (!testsId)
    throw (
      "process.env.TESTS_ID is undefined. " +
      "Environment variable should be set in the tests framework config, before global setup is run. " +
      "This id is for identifying created testCollections during tests."
    );
  const testAccountEmail = process.env.TEST_ACCOUNT_EMAIL;
  if (!testAccountEmail)
    throw (
      "process.env.TEST_ACCOUNT_EMAIL is undefined. Environment variable should be set in tests " +
      "global setup. This is required to log in to the test user account"
    );
  const testAccountPassword = process.env.TEST_ACCOUNT_PASSWORD;
  if (!testAccountPassword)
    throw (
      "process.env.TEST_ACCOUNT_PASSWORD is undefined. Environment variable should be set in tests " +
      "global setup. This is required to log in to the test user account"
    );
  // Don't use auth from "db/firebase", because it's mocked.
  const auth = getAuth(app);
  const testUserAccount = await signInWithEmailAndPassword(
    auth,
    testAccountEmail,
    testAccountPassword
  );

  await createGlobalCounter();

  if (!testCollectionsId)
    throw (
      "testCollectionsId is not a non-empty string. This id is for mocking production collections " +
      "and for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
    );
  const testCollections: TestCollections = {
    id: testCollectionsId,
    testsId: testsId,
    signedInTestUserId: null,
    requiredAuthenticatedUserId: testUserAccount.user.uid,
  };
  return adminDb
    .collection(COLLECTIONS.testCollections)
    .doc(testCollectionsId)
    .create(testCollections);
}
