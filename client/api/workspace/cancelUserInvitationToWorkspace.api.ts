import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenOpenWorkspace from "./listenOpenWorkspace.api";

/**
 * Cancels a user invitation to the open workspace if they have been invited.
 * @param userEmail The email of the user to cancel invitation.
 * @throws {Error} When the open workspace document is not found.
 * When the user with the provided email is not invited to the open workspace.
 */
export default async function cancelUserInvitationToWorkspace(userEmail: string): Promise<void> {
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  if (!openWorkspace.invitedUserEmails.includes(userEmail))
    throw new Error(`The user with email ${userEmail} is not invited to the open workspace.`);
  const res = await fetchApi(CLIENT_API_URLS.workspace.cancelUserInvitationToWorkspace, {
    workspaceId: openWorkspace.id,
    targetUserEmail: userEmail,
  });
  await handleApiResponse(res);
}
