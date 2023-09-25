import API_URLS from "common/constants/apiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import ApiError from "common/types/apiError.class";
import testCollectionsId from "./setup/testCollectionsId.constant";

export async function addUsersToWorkspace(userIds: string[], workspaceId: string): Promise<void> {
  const res = await fetchTestApi(API_URLS.tests.addUsersToWorkspace, {
    testCollectionsId,
    userIds,
    workspaceId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
