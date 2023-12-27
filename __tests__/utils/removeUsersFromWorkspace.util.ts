import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import ApiError from "common/types/apiError.class";

/**
 * Removes provided user ids from the workspace and cancels provided email invitations to the workspace.
 */
export async function removeUsersFromWorkspace(
  workspaceId: string,
  userIds: string[],
  userEmails: string[] = []
): Promise<void> {
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.removeUsersFromWorkspace, {
    userIds,
    userEmails,
    workspaceId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
