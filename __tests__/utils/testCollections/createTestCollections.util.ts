import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
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
  return handleApiResponse(res);
}
