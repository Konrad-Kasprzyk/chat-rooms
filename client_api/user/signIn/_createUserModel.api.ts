import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import { auth } from "db/client/firebase";

/**
 * Creates user model. It doesn't register a new user.
 * @returns user id
 * @throws {string} When the user is not signed in.
 */
export default async function _createUserModel(username: string): Promise<string> {
  if (!auth.currentUser) throw "User is not signed in.";
  const res = await fetchApi(API_URLS.user.createUserModel, { username });
  if (!res.ok) throw await res.text();
  const userId = res.text();
  return userId;
}
