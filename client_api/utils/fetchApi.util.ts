import APP_URL from "common/constants/appUrl.constant";
import auth from "common/db/auth.firebase";
import type clientApiUrls from "common/types/clientApiUrls.type";

/**
 * This function gets the current user id token and fetches with it the backend api.
 * @throws {Error} When the user is not signed in.
 */
export default async function fetchApi(apiUrl: clientApiUrls, body: object = {}) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Fetch api error. The user is not signed in.");
  const idToken = await currentUser.getIdToken();
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, idToken }),
  });
}
