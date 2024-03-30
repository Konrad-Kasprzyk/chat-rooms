import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Sends a message to the open chat room.
 * @throws {Error} When the message is an empty string.
 * When the open workspace document is not found.
 */
export default async function sendMessage(message: string): Promise<void> {
  if (!message) throw new Error("The message to send is an empty string.");
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.sendMessage, {
    workspaceId: openWorkspace.id,
    message,
  });
  await handleApiResponse(res);
}
