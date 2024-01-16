import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import MAX_INVITED_USERS from "common/constants/maxInvitedUsers.constant";
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
  if (!openWorkspace) throw new Error("The open workspace document not found.");
  if (openWorkspace.invitedUserEmails.includes(userEmail))
    throw new Error(`The user with email ${userEmail} is already invited to the open workspace.`);
  if (openWorkspace.invitedUserEmails.length >= MAX_INVITED_USERS)
    throw new Error("The open workspace has a maximum number of invited users.");
  const res = await fetchApi(CLIENT_API_URLS.workspace.inviteUserToWorkspace, {
    workspaceId: openWorkspace.id,
    targetUserEmail: userEmail,
  });
  await handleApiResponse(res);
}
