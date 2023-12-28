import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import ApiError from "common/types/apiError.class";
import testCollectionsId from "./testCollectionsId.constant";

/**
 * @param {string} testsId - A string representing the ID of the test for which the collections are
 * being created.
 * @returns The created test collections ID
 */
export async function createTestCollections(testsId: string): Promise<string> {
  if (!testCollectionsId)
    throw new Error(
      "testCollectionsId is not a non-empty string. This id is for mocking production collections " +
        "and for the backend to use the proper test collections. " +
        "Cannot run tests on production collections."
    );
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.createTestCollections, {
    testsId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.text();
}
