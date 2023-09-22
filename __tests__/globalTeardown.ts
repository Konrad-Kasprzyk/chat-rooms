// This import at top of the other imports fixes absolute imports in setup and teardown tests files.
import "tsconfig-paths/register";
import auth from "common/db/auth.firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { deleteTestCollections } from "./utils/setup/deleteTestCollections.util";

/**
 * This function deletes test collections document with collections stored in that document.
 * This means that all data created during tests will be deleted.
 * This function also deletes the main test user account.
 */
export default async function globalTeardown() {
  const testsId = process.env.TESTS_ID;
  if (!testsId)
    throw (
      "process.env.TESTS_ID is undefined. " +
      "Environment variable should be set in the tests framework config, before global setup is run. " +
      "This id is for identifying created testCollections during tests."
    );
  await deleteTestCollections(testsId);
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
  const testUserAccount = await signInWithEmailAndPassword(
    auth,
    testAccountEmail,
    testAccountPassword
  );
  return testUserAccount.user.delete();
}
