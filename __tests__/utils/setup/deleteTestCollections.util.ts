import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import ApiError from "common/types/apiError.class";

export async function deleteTestCollections(testsId: string): Promise<void> {
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.deleteTestCollections, {
    testsId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
