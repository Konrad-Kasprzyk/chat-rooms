import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";

/**
 * @returns The created workspace id.
 * @throws {Error} When the user details document is not found.
 * When the title is an empty string.
 */
export default async function createWorkspace(
  title: string,
  description?: string,
  url?: string
): Promise<string> {
  if (!title) throw new Error("The provided title is an empty string.");
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (!userDetailsDoc) throw new Error("The user details document not found.");
  const workspaceDescription = description || "";
  const workspaceUrl = url || "";
  const res = await fetchApi(CLIENT_API_URLS.workspace.createWorkspace, {
    title,
    description: workspaceDescription,
    url: workspaceUrl,
  });
  const workspaceId = await handleApiResponse(res);
  return workspaceId;
}
