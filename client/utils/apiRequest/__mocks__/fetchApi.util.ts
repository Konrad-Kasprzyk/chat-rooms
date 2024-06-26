import testCollectionsId from "__tests__/utils/testCollections/testCollectionsId.constant";
import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import auth from "client/db/auth.firebase";
import APP_URL from "common/constants/appUrl.constant";
import type clientApiUrls from "common/types/clientApiUrls.type";

/**
 * This function doesn't require the user to be signed in. The api private key is used to
 * authenticate to the backend. Sends test collections id to the api.
 * @param useMainUserId Use main user id even if user is signed in as a linked bot,
 * defaults to false.
 */
export default async function fetchApi(
  apiUrl: clientApiUrls,
  body: object = {},
  useMainUserId: boolean = false
) {
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
  const useBotId = signedInUserId == currentUser.uid || useMainUserId ? undefined : signedInUserId;
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
