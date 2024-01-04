import fetchTestApi from "__tests__/utils/fetchTestApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";

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
  await handleApiResponse(res);
}
