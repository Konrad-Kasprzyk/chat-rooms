import API_URLS from "common/constants/apiUrls";
import fetchTestApi from "common/test_utils/fetchTestApi";

export async function deleteTestCollections(testsId: string): Promise<void> {
  const res = await fetchTestApi(API_URLS.tests.deleteTestCollections, {
    testsId,
  });
  if (!res.ok) throw await res.text();
}
