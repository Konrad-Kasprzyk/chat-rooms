import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import ApiError from "common/types/apiError.class";

/**
 * Adds provided user ids to the workspace and invites provided emails to the workspace.
 * @throws {ApiError} When the number of user ids exceeds 10 or the number of user emails exceeds 10.
 */
export async function addUsersToWorkspace(
  workspaceId: string,
  userIds: string[],
  userEmails: string[] = []
): Promise<void> {
  if (userIds.length > 10)
    throw new Error("The number of user ids to add to the workspace exceeds 10");
  if (userEmails.length > 10)
    throw new Error("The number of user emails to invite to the workspace exceeds 10");
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.addUsersToWorkspace, {
    userIds,
    userEmails,
    workspaceId,
  });
  await handleApiResponse(res);
}
