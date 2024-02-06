import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Adds a bot to the open workspace. Bot can add another bot and the signed in user as well.
 * @param botId Id of the bot to add to the workspace.
 * @throws {Error} When The provided bot id does not belong to the actual signed in user's linked ids.
 * When the open workspace document is not found or the bot already belongs to the open workspace.
 */
export default async function addBotToWorkspace(botId: string): Promise<void> {
  const userDetails = await firstValueFrom(listenCurrentUserDetails());
  if (!userDetails?.linkedUserDocumentIds.includes(botId))
    throw new Error(
      `The provided bot id ${botId} does not belong to the actual signed in user's linked ids.`
    );
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  if (openWorkspace.userIds.includes(botId))
    throw new Error(`The bot with id ${botId} already belongs to the open workspace`);
  const res = await fetchApi(CLIENT_API_URLS.workspace.addBotToWorkspace, {
    workspaceId: openWorkspace.id,
    botId,
  });
  await handleApiResponse(res);
}
