import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import handleApiResponse from "clientApi/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import auth from "common/db/auth.firebase";
import { firstValueFrom } from "rxjs";
import listenCurrentUserDetails from "../listenCurrentUserDetails.api";

/**
 * Creates a user document. It doesn't register a new user.
 * @returns user's document id
 * @throws {Error} When the user is not signed in or it's document already exists.
 */
export default async function _createUserDocument(username: string): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("The user is not signed in.");
  /**
   * If the user's document is not found or is marked as deleted,
   * a temporary document with data from the firebase account is sent.
   * However, if the user details document is not found or is marked as deleted, then null is sent.
   */
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (userDetailsDoc) throw new Error("The user document already exists.");
  const res = await fetchApi(CLIENT_API_URLS.user.createUserDocument, { username });
  const userId = await handleApiResponse(res);
  return userId;
}
