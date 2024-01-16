import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";

/**
 * @returns The created workspace id.
 * @throws {Error} When the user details document is not found.
 * When the provided url or title is an empty string.
 */
export default async function createEmptyWorkspace(
  url: string,
  title: string,
  description: string
): Promise<string> {
  if (!url) throw new Error("The provided url is an empty string.");
  if (!title) throw new Error("The provided title is an empty string.");
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (!userDetailsDoc) throw new Error("The user details document not found.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
    url,
    title,
    description,
  });
  const workspaceId = await handleApiResponse(res);
  return workspaceId;
}
