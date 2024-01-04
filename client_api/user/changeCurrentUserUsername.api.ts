import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "./listenCurrentUser.api";

/**
 * Changes the current user username. Can be an empty string.
 * @throws {string} When the user document is not found.
 */
export default async function changeCurrentUserUsername(newUsername: string): Promise<void> {
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw new Error("User document not found.");
  const res = await fetchApi(CLIENT_API_URLS.user.changeUserUsername, { newUsername });
  await handleApiResponse(res);
}
