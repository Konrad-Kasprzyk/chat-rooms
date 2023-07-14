import API_URLS from "common/constants/apiUrls";
import fetchTestApi from "common/test_utils/fetchTestApi";
import testCollectionsId from "./setup/testCollectionsId";

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
