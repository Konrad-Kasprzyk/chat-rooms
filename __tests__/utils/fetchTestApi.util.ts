import testCollectionsId from "__tests__/utils/testCollections/testCollectionsId.constant";
import APP_URL from "common/constants/appUrl.constant";
import clientApiUrls from "common/types/clientApiUrls.type";
import scriptApiUrls from "common/types/scriptApiUrls.type";

/**
 * This function doesn't require the user to be signed in. The api private key is used to
 * authenticate to the backend. Beside the api private key and test collections id,
 * no parameters are sent additionally.
 */
export default function fetchTestApi(apiUrl: scriptApiUrls | clientApiUrls, body: object = {}) {
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
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      testCollectionsId,
      privateApiKey,
    }),
  });
}
