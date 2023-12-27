import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import auth from "common/db/auth.firebase";
import ApiError from "common/types/apiError.class";
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
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const userId = res.text();
  return userId;
}
