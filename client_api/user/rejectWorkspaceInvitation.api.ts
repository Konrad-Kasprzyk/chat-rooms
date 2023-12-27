import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import ApiError from "common/types/apiError.class";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "./listenCurrentUser.api";

/**
 * Rejects a workspace invitation.
 * @throws {Error} When the user document is not found.
 * When the user is not invited to the provided workspace.
 */
export default async function rejectWorkspaceInvitation(workspaceId: string): Promise<void> {
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw new Error("User document not found.");
  if (!userDoc.workspaceInvitationIds.includes(workspaceId))
    throw new Error(`The user is not invited to the workspace with id ${workspaceId}`);
  const res = await fetchApi(CLIENT_API_URLS.user.rejectWorkspaceInvitation, {
    workspaceId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
