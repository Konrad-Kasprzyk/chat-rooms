import { auth } from "../../db/firebase";
import APP_URL from "../constants/url";

export default async function fetchPost(apiUrl: string, body: object = {}) {
  if (!auth.currentUser) throw "Fetch POST error. User is not logged in.";
  const idToken = await auth.currentUser.getIdToken();
  let testCollectionsId: string | undefined = undefined;
  if (process.env.NODE_ENV === "test") {
    testCollectionsId = process.env.TEST_COLLECTIONS_ID;
    if (!testCollectionsId)
      throw (
        "process.env.TEST_COLLECTIONS_ID is undefined. " +
        "Environment variable should be set in tests framework config, before global setup is run. " +
        "Cannot run tests on production collections."
      );
  }
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, idToken, ...(testCollectionsId ? { testCollectionsId } : {}) }),
  });
}
