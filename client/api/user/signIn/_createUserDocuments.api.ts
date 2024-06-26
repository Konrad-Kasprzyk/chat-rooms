import auth from "client/db/auth.firebase";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { firstValueFrom } from "rxjs";
import listenCurrentUserDetails from "../listenCurrentUserDetails.api";

/**
 * Creates a user document if it doesn't exist. It doesn't register a new user.
 * @returns User's document id
 * @throws {Error} When the user is not signed in or it's document is loaded in the user details
 * document listener.
 */
export default async function _createUserDocuments(username: string): Promise<string> {
  if (!username) throw new Error("The username is required to be a non-empty string.");
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("The user is not signed in.");
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (userDetailsDoc) throw new Error("The user document already exists.");
  const res = await fetchApi(CLIENT_API_URLS.user.createUserDocuments, { username });
  const userId = await handleApiResponse(res);
  return userId;
}
