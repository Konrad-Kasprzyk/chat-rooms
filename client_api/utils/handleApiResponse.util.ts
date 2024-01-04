import { ApiError } from "next/dist/server/api-utils";

/**
 * Checks if the response has a successful status. Parses and returns the json body of the response.
 * Requires the response body to be a string if the response status is not 204.
 * @throws {ApiError} When response status is not successful.
 * @throws {Error} When response has a status other than 204 (no content) and the response body
 * is not a non-empty string.
 * @returns Api text response.
 */
export default async function handleApiResponse(res: Response): Promise<string> {
  if (!res.ok) throw new ApiError(res.status, await res.text());
  if (res.status == 204) return "";
  const resJson = await res.json();
  if (!resJson || typeof resJson !== "string")
    throw new Error("Api response is not a non-empty string.");
  return resJson;
}
