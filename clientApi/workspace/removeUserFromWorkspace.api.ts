import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Removes a user from the open workspace.
 * @param userIdToRemove The id of the user to remove from the workspace.
 * @throws {Error} When the open workspace document is not found.
 * When the user to remove does not belong to the open workspace.
 */
export default async function removeUserFromWorkspace(userIdToRemove: string): Promise<void> {
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  if (!openWorkspace.userIds.includes(userIdToRemove))
    throw new Error(
      `The user with id ${userIdToRemove} to remove from the workspace does not belong to it.`
    );
  const res = await fetchApi(CLIENT_API_URLS.workspace.removeUserFromWorkspace, {
    workspaceId: openWorkspace.id,
    userIdToRemove,
  });
  await handleApiResponse(res);
}
