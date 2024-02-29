import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenCurrentUserDetails from "./listenCurrentUserDetails.api";

/**
 * Changes the current user username. Can be an empty string.
 * @throws {Error} When the user details document is not found.
 */
export default async function changeCurrentUserUsername(newUsername: string): Promise<void> {
  if (!newUsername) throw new Error("The username is required to be a non-empty string.");
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (!userDetailsDoc) throw new Error("The user details document not found.");
  const res = await fetchApi(CLIENT_API_URLS.user.changeUserUsername, { newUsername });
  await handleApiResponse(res);
}
