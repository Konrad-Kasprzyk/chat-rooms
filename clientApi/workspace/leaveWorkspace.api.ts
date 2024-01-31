import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "./openWorkspaceId.utils";

/**
 * Leaves the open workspace.
 * @throws {Error} When the open workspace document is not found.
 */
export default async function leaveWorkspace(): Promise<void> {
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  setOpenWorkspaceId(null);
  const res = await fetchApi(CLIENT_API_URLS.workspace.leaveWorkspace, {
    workspaceId: openWorkspace.id,
  });
  await handleApiResponse(res);
}
