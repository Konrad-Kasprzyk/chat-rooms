import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import ApiError from "common/types/apiError.class";
import { doc, getDoc } from "firebase/firestore";

/**
 * Creates a user document. It doesn't register a new user.
 * @returns user's document id
 * @throws {string} When the user is not signed in or it's document already exists.
 */
export default async function _createUserDocument(username: string): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User is not signed in.");
  const userDoc = await getDoc(doc(collections.users, uid));
  if (userDoc.exists()) throw new Error("User document already exists.");
  const res = await fetchApi(API_URLS.user.createUserDocument, { username });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const userId = res.text();
  return userId;
}
