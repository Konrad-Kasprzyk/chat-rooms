import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import auth from "common/db/auth.firebase";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "./listenCurrentUser.api";

/**
 * @throws {string} When the user is not signed in or the user document is not found.
 */
export default async function changeCurrentUserUsername(newUsername: string): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw "User document not found.";
  const res = await fetchApi(API_URLS.user.changeUserUsername, { newUsername });
  if (!res.ok) throw await res.text();
}
