import API_URLS from "common/constants/apiUrls";
import fetchTestApi from "common/test_utils/fetchTestApi";
import testCollectionsId from "./testCollectionsId";

export async function createGlobalCounter(): Promise<void> {
  const res = await fetchTestApi(API_URLS.tests.createGlobalCounter, {
    testCollectionsId,
  });
  if (!res.ok) throw await res.text();
}
