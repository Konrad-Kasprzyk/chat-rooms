import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import ApiError from "common/types/apiError.class";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "./listenCurrentUser.api";
import listenCurrentUserDetails from "./listenCurrentUserDetails.api";

/**
 * Uncovers a hidden workspace invitation.
 * @throws {Error} When the user document is not found or the user details document is not found.
 * When the user is not invited to the provided workspace or the workspace invitation is not hidden.
 */
export default async function uncoverWorkspaceInvitation(workspaceId: string): Promise<void> {
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw new Error("User document not found.");
  if (!userDoc.workspaceInvitationIds.includes(workspaceId))
    throw new Error(`The user is not invited to the workspace with id ${workspaceId}`);
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (!userDetailsDoc) throw new Error("User details document not found.");
  if (!userDetailsDoc.hiddenWorkspaceInvitationsIds.includes(workspaceId))
    throw new Error(`The workspace with id ${workspaceId} is not hidden.`);
  const res = await fetchApi(CLIENT_API_URLS.user.uncoverWorkspaceInvitation, { workspaceId });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
