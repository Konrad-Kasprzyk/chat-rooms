// This import at top of the other imports fixes absolute imports in setup and teardown tests files.
import "tsconfig-paths/register";
import { registerTestUserEmailPassword } from "common/test_utils/registerTestUserEmailPassword.util";
import { v4 as uuidv4 } from "uuid";

/**
 * This function creates the main test user account and saves it's email and password in
 * environment variables.
 * Firestore rules will require this user to be signed in to use the test collections.
 */
export default async function globalSetup() {
  const password = uuidv4();
  // Omit milliseconds and make valid to use in an email.
  const dateString = new Date().toISOString().slice(0, 19).split(":").join(".");
  const email = dateString + "@normkeeper.testing";
  const displayName = "testing user";
  process.env.TEST_ACCOUNT_EMAIL = email;
  process.env.TEST_ACCOUNT_PASSWORD = password;
  return registerTestUserEmailPassword(email, password, displayName);
}
