import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import ApiError from "common/types/apiError.class";
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
  if (!openWorkspace) throw new Error("Open workspace document not found.");
  if (openWorkspace.isInBin) throw new Error("The open workspace is in the recycle bin.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceTitle, {
    workspaceId: openWorkspace.id,
    newTitle,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
