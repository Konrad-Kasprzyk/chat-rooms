import API_URLS from "common/constants/apiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import testCollectionsId from "./testCollectionsId.constant";

export async function createGlobalCounter(): Promise<void> {
  const res = await fetchTestApi(API_URLS.tests.createGlobalCounter, {
    testCollectionsId,
  });
  if (!res.ok) throw await res.text();
}
