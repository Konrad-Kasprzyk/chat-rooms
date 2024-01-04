import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Invites a user to the open workspace if they have not already been invited.
 * @param userEmail The email of the user to be invited.
 * @throws {Error} When the open workspace document is not found.
 * When the user with the provided email is already invited.
 */
export default async function inviteUserToWorkspace(userEmail: string): Promise<void> {
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("Open workspace document not found.");
  if (openWorkspace.isInBin) throw new Error("The open workspace is in the recycle bin.");
  if (openWorkspace.invitedUserEmails.includes(userEmail))
    throw new Error(`The user with email ${userEmail} is already invited to the open workspace.`);
  const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
    workspaceId: openWorkspace.id,
    targetUserEmail: userEmail,
  });
  await handleApiResponse(res);
}
