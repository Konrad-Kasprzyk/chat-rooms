import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Changes the open workspace description. Can be an empty string.
 * @throws {Error} When the open workspace document is not found.
 */
export default async function changeWorkspaceDescription(newDescription: string): Promise<void> {
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceDescription, {
    workspaceId: openWorkspace.id,
    newDescription,
  });
  await handleApiResponse(res);
}
