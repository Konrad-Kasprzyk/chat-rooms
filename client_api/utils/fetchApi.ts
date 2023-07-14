import APP_URL from "common/constants/appUrl";
import type apiUrls from "common/types/apiUrls";
import { auth } from "db/firebase";

export default async function fetchApi(apiUrl: apiUrls, body: object = {}) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw "Fetch POST error. User is not signed in.";
  const idToken = await currentUser.getIdToken();
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, idToken }),
  });
}
