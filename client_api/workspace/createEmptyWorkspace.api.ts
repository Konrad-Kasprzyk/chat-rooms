import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";

/**
 * @returns The created workspace id.
 * @throws {string} When the user document is not found.
 * When the provided url or title is an empty string.
 */
export default async function createEmptyWorkspace(
  url: string,
  title: string,
  description: string
): Promise<string> {
  if (!url) throw new Error("The provided url is an empty string.");
  if (!title) throw new Error("The provided title is an empty string.");
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw new Error("User document not found.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
    url,
    title,
    description,
  });
  const workspaceId = await handleApiResponse(res);
  return workspaceId;
}
