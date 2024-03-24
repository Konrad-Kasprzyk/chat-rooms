import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";

/**
 * Marks the workspace and workspace summary documents as deleted. Removes the workspace id from
 * the belonging and invited users.
 * @throws {Error} When the user document is not found.
 * When the user does not belong to the workspace.
 */
export default async function markWorkspaceDeleted(workspaceId: string): Promise<void> {
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc?.workspaceIds.includes(workspaceId))
    throw new Error(`The user does not belong to the workspace with id ${workspaceId}`);
  const res = await fetchApi(CLIENT_API_URLS.workspace.markWorkspaceDeleted, {
    workspaceId: workspaceId,
  });
  await handleApiResponse(res);
}
