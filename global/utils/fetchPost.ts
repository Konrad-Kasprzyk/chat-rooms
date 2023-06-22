import { auth } from "db/firebase";
import APP_URL from "global/constants/url";

export default async function fetchPost(apiUrl: string, body: object = {}) {
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
