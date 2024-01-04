import fetchApi from "client_api/utils/fetchApi.util";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import auth from "common/db/auth.firebase";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "../listenCurrentUser.api";

/**
 * Creates a user document. It doesn't register a new user.
 * @returns user's document id
 * @throws {string} When the user is not signed in or it's document already exists.
 */
export default async function _createUserDocument(username: string): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("The user is not signed in.");
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (userDoc) throw new Error("The user document already exists.");
  const res = await fetchApi(CLIENT_API_URLS.user.createUserDocument, { username });
  const userId = await handleApiResponse(res);
  return userId;
}
