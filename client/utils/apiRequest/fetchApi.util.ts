import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import auth from "client/db/auth.firebase";
import APP_URL from "common/constants/appUrl.constant";
import type clientApiUrls from "common/types/clientApiUrls.type";

/**
 * This function gets the current user id token and fetches with it the backend api.
 * @param useMainUserId Use main user id even if user is signed in as a linked bot,
 * defaults to false.
 * @throws {Error} When the user is not signed in.
 */
export default async function fetchApi(
  apiUrl: clientApiUrls,
  body: object = {},
  useMainUserId: boolean = false
) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Fetch api error. The user is not signed in.");
  const signedInUserId = getSignedInUserId();
  const useBotId = signedInUserId == currentUser.uid || useMainUserId ? undefined : signedInUserId;
  const idToken = await currentUser.getIdToken();
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, useBotId, idToken }),
  });
}
