import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "./listenCurrentUser.api";
import listenCurrentUserDetails from "./listenCurrentUserDetails.api";

/**
 * Accepts a workspace invitation.
 * @throws {Error} When the user or user details document is not found.
 * When the user is not invited to the provided workspace.
 */
export default async function acceptWorkspaceInvitation(workspaceId: string): Promise<void> {
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (!userDetailsDoc) throw new Error("The user details document not found.");
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc?.workspaceInvitationIds.includes(workspaceId))
    throw new Error(`The user is not invited to the workspace with id ${workspaceId}`);
  const res = await fetchApi(CLIENT_API_URLS.user.acceptWorkspaceInvitation, {
    workspaceId,
  });
  await handleApiResponse(res);
}
