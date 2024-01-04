/**
 * Runs only once at the end of all test files.
 */

// This import at top of the other imports fixes absolute imports in setup and teardown tests files.
import "tsconfig-paths/register";
import { deleteTestCollections } from "./utils/testCollections/deleteTestCollections.util";

/**
 * This function deletes test collections document with collections stored in that document.
 * This means that all data created during tests will be deleted.
 */
export default async function globalTeardown() {
  const testsId = process.env.TESTS_ID;
  if (!testsId)
    throw new Error(
      "process.env.TESTS_ID is undefined. " +
        "Environment variable should be set in the tests framework config, before global setup is run. " +
        "This id is for identifying created testCollections during tests."
    );
  await deleteTestCollections(testsId);
}
