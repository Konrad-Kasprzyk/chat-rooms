import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";

/**
 * Retrieves a workspace from the recycle bin.
 * @throws {Error} When the user document is not found.
 * When the user does not belong to the workspace.
 */
export default async function retrieveWorkspaceFromRecycleBin(workspaceId: string): Promise<void> {
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc?.workspaceIds.includes(workspaceId))
    throw new Error(`The user does not belong to the workspace with id ${workspaceId}`);
  const res = await fetchApi(CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin, {
    workspaceId: workspaceId,
  });
  await handleApiResponse(res);
}
