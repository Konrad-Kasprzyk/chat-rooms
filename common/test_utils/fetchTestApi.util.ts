import APP_URL from "common/constants/appUrl.constant";
import type apiUrls from "common/types/apiUrls.type";

/**
 * This function doesn't require the user to be signed in. Only the api private key is used to
 * authenticate to the backend. Beside the api private key, no parameters are sent additionally.
 */
export default function fetchTestApi(apiUrl: apiUrls, body: object = {}) {
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
      privateApiKey,
    }),
  });
}
