import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "./listenCurrentUser.api";
import signOut from "./signOut.api";

/**
 * Marks the current user deleted.
 * @throws {Error} When the current user document is not found.
 * When the current user document is already marked as deleted
 */
export default async function markCurrentUserDeleted(): Promise<void> {
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw new Error("User document not found.");
  if (userDoc.isDeleted) throw new Error("The user document is already marked as deleted.");
  const res = await fetchApi(CLIENT_API_URLS.user.markUserDeleted);
  await handleApiResponse(res);
  await signOut();
}
