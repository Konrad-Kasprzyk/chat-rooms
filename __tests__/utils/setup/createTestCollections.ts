import fetchTestPost from "common/test_utils/fetchTestPost";
import testCollectionsId from "./testCollectionsId";

/**
 * @param {string} testsId - A string representing the ID of the test for which the collections are
 * being created.
 * @param {string} requiredAuthenticatedUserId - The requiredAuthenticatedUserId parameter is a string
 * that represents the user ID of the authenticated user who is required to have access to the test
 * collections being created. This parameter is used to ensure that only authorized users can create
 * and access the test collections.
 * @returns The created test collections ID
 */
export async function createTestCollections(
  testsId: string,
  requiredAuthenticatedUserId: string
): Promise<string> {
  const res = await fetchTestPost("api/tests/create-test-collections", {
    testCollectionsId,
    testsId,
    requiredAuthenticatedUserId,
  });
  if (!res.ok) throw await res.text();
  return res.text();
}