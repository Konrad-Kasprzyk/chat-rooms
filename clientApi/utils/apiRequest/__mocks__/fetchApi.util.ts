import testCollectionsId from "__tests__/utils/testCollections/testCollectionsId.constant";
import { getSignedInUserId } from "clientApi/user/signedInUserId.utils";
import APP_URL from "common/constants/appUrl.constant";
import auth from "common/db/auth.firebase";
import type clientApiUrls from "common/types/clientApiUrls.type";

/**
 * This function doesn't require the user to be signed in. The api private key is used to
 * authenticate to the backend. Sends test collections id to the api.
 */
export default async function fetchApi(apiUrl: clientApiUrls, body: object = {}) {
  if (!testCollectionsId)
    throw new Error(
      "testCollectionsId is not a non-empty string. " +
        "This id is for the backend to use the proper test collections. " +
        "Cannot run tests on production collections."
    );
  const privateApiKey = process.env.API_PRIVATE_KEY;
  if (!privateApiKey)
    throw new Error(
      "process.env.API_PRIVATE_KEY is undefined. Environment variable should be inside .env file."
    );
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Fetch api error. The user is not signed in.");
  const signedInUserId = getSignedInUserId();
  const useBotId = signedInUserId == currentUser.uid ? undefined : signedInUserId;
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      uid: currentUser.uid,
      email: currentUser.email,
      useBotId,
      testCollectionsId,
      privateApiKey,
    }),
  });
}
