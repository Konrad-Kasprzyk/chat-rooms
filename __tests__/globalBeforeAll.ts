const auth =
  jest.requireActual<typeof import("common/db/auth.firebase")>("common/db/auth.firebase").default;

import { signInWithEmailAndPassword } from "firebase/auth";
import { createTestCollections } from "./utils/setup/createTestCollections.util";

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
  const testUserAccount = await signInWithEmailAndPassword(
    auth,
    testAccountEmail,
    testAccountPassword
  );
  await createTestCollections(testsId, testUserAccount.user.uid);
}
