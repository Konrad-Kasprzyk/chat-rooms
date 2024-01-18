import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";

export async function deleteTestCollections(testsId: string): Promise<void> {
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.deleteTestCollections, {
    testsId,
  });
  await handleApiResponse(res);
}
