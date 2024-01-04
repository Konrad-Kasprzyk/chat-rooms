/**
 * Should be run in each test file at the beginning of the beforeAll hook.
 */

import { createTestCollections } from "./utils/testCollections/createTestCollections.util";
// Import for side effects. It connects to auth emulator.
import "common/db/auth.firebase";

/**
 * This function creates the test collections document.
 */
export default async function globalBeforeAll() {
  const testsId = process.env.TESTS_ID;
  if (!testsId)
    throw new Error(
      "process.env.TESTS_ID is undefined. " +
        "Environment variable should be set in the tests framework config, before global setup is run. " +
        "This id is for identifying created testCollections during tests."
    );
  await createTestCollections(testsId);
}
