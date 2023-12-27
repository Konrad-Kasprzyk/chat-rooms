import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import ApiError from "common/types/apiError.class";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Changes the open workspace description. Can be an empty string.
 * @throws {Error} When the open workspace document is not found.
 */
export default async function changeWorkspaceDescription(newDescription: string): Promise<void> {
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("Open workspace document not found.");
  if (openWorkspace.isInBin) throw new Error("The open workspace is in the recycle bin.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceDescription, {
    workspaceId: openWorkspace.id,
    newDescription,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
