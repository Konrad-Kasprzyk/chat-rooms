import API_URLS from "common/constants/apiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import ApiError from "common/types/apiError.class";
import testCollectionsId from "./testCollectionsId.constant";

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
  if (!testCollectionsId)
    throw new Error(
      "testCollectionsId is not a non-empty string. This id is for mocking production collections " +
        "and for the backend to use the proper test collections. " +
        "Cannot run tests on production collections."
    );
  const res = await fetchTestApi(API_URLS.tests.createTestCollections, {
    testCollectionsId,
    testsId,
    requiredAuthenticatedUserId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.text();
}
