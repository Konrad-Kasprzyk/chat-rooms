import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "./openWorkspaceId.utils";

/**
 * Leaves the provided workspace.
 * @throws {Error} When the user does not belong to the provided workspace.
 */
export default async function leaveWorkspace(workspaceId: string): Promise<void> {
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc?.workspaceIds.includes(workspaceId))
    throw new Error(`The user does not belong to the workspace with id ${workspaceId}`);
  if (getOpenWorkspaceId() == workspaceId) setOpenWorkspaceId(null);
  const res = await fetchApi(CLIENT_API_URLS.workspace.leaveWorkspace, {
    workspaceId,
  });
  await handleApiResponse(res);
}
