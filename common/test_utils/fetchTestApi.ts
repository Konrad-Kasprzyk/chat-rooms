import APP_URL from "common/constants/appUrl";
import type apiUrls from "common/types/apiUrls";
import "cross-fetch/polyfill";

/**
 * This function doesn't require the user to be signed in. Only the test private key is used to
 * authenticate to the backend. Beside the test private key, no params are sent additionally.
 */
export default async function fetchTestApi(apiUrl: apiUrls, body: object = {}) {
  const testKey = process.env.TESTS_KEY;
  if (!testKey)
    throw (
      "process.env.TESTS_KEY is undefined. Environment variable should be inside .env file. " +
      "Tests private key is necessary to send a testCollectionsId to the backend."
    );
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      testKey,
    }),
  });
}
