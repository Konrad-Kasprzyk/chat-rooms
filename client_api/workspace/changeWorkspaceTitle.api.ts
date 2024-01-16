import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Changes the open workspace title.
 * @throws {Error} When the open workspace document is not found.
 * When the provided new title is an empty string.
 */
export default async function changeWorkspaceTitle(newTitle: string): Promise<void> {
  if (!newTitle) throw new Error("The provided new title is an empty string.");
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceTitle, {
    workspaceId: openWorkspace.id,
    newTitle,
  });
  await handleApiResponse(res);
}
