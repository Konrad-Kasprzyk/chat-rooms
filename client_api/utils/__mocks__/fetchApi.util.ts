import testCollectionsId from "__tests__/utils/setup/testCollectionsId.constant";
import APP_URL from "common/constants/appUrl.constant";
import type apiUrls from "common/types/apiUrls.type";
import { auth } from "db/client/firebase";

export default async function fetchApi(apiUrl: apiUrls, body: object = {}) {
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
