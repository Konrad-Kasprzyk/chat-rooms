import { auth } from "db/firebase";
import APP_URL from "global/constants/url";
import testCollectionsId from "../test_utils/testCollectionsId";

export default async function fetchPost(apiUrl: string, body: object = {}) {
  if (!testCollectionsId)
    throw (
      "testCollectionsId is not a non-empty string. " +
      "This id is for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
    );
  const testKey = process.env.TESTS_KEY;
  if (!testKey)
    throw (
      "process.env.TESTS_KEY is undefined. Environment variable should be inside .env file. " +
      "Tests private key is necessary to send a testCollectionsId to the backend."
    );
  const currentUser = auth.currentUser;
  if (!currentUser) throw "Fetch POST error. User is not signed in.";
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      uid: currentUser.uid,
      email: currentUser.email,
      testCollectionsId,
      testKey,
    }),
  });
}
