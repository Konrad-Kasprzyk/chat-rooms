import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Creates user and userSummary documents. It doesn't register a new user.
 * @returns user's document id
 * @throws {string} When the user is not signed in or it's document already exists.
 */
// TODO create user summary doc
export default async function _createUserDocuments(username: string): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw "User is not signed in.";
  const userDoc = await getDoc(doc(collections.users, uid));
  if (userDoc.exists()) throw "User document already exists.";
  const res = await fetchApi(API_URLS.user.createUserDocuments, { username });
  if (!res.ok) throw await res.text();
  const userId = res.text();
  return userId;
}
