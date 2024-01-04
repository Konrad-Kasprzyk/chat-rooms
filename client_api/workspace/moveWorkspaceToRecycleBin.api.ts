import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Moves the open workspace to the recycle bin if it is not already there.
 * @throws {Error} When the open workspace document is not found.
 * When the open workspace is already in the recycle bin.
 */
export default async function moveWorkspaceToRecycleBin(): Promise<void> {
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("Open workspace document not found.");
  if (openWorkspace.isInBin)
    throw new Error("The open workspace document is already in the recycle bin.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.moveWorkspaceToRecycleBin, {
    workspaceId: openWorkspace.id,
  });
  await handleApiResponse(res);
}
