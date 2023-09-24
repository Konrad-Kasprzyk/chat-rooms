import testCollectionsId from "__tests__/utils/setup/testCollectionsId.constant";
import APP_URL from "common/constants/appUrl.constant";
import auth from "common/db/auth.firebase";
import type apiUrls from "common/types/apiUrls.type";

export default async function fetchApi(apiUrl: apiUrls, body: object = {}) {
  if (!testCollectionsId)
    throw (
      "testCollectionsId is not a non-empty string. " +
      "This id is for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
    );
  const privateApiKey = process.env.API_PRIVATE_KEY;
  if (!privateApiKey)
    throw "process.env.API_PRIVATE_KEY is undefined. Environment variable should be inside .env file.";
  const currentUser = auth.currentUser;
  if (!currentUser) throw "Fetch api error. The user is not signed in.";
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
      privateApiKey,
    }),
  });
}
