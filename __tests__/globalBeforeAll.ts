import app from "common/db/app.firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { createTestCollections } from "./utils/setup/createTestCollections.util";
// Import for side effects. It connects to auth emulator.
import "common/db/auth.firebase";

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
  const realAuth = getAuth(app);
  const testUserAccount = await signInWithEmailAndPassword(
    realAuth,
    testAccountEmail,
    testAccountPassword
  );
  await createTestCollections(testsId, testUserAccount.user.uid);
}
