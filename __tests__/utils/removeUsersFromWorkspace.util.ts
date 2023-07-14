import API_URLS from "common/constants/apiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import testCollectionsId from "./setup/testCollectionsId.constant";

export async function removeUsersFromWorkspace(
  userIds: string[],
  workspaceId: string
): Promise<void> {
  const res = await fetchTestApi(API_URLS.tests.removeUsersFromWorkspace, {
    testCollectionsId,
    userIds,
    workspaceId,
  });
  if (!res.ok) throw await res.text();
}
