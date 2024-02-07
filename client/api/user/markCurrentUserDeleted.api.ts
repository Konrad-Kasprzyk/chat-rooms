import auth from "client/db/auth.firebase";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import signOut from "./signOut.api";

/**
 * Marks user and user details documents as deleted and deletes the user account.
 * Deletes the user account even if the user document is not found or
 * has already been marked as deleted.
 * @throws {Error} When the user is not signed in.
 */
export default async function markCurrentUserDeleted(): Promise<void> {
  if (!auth.currentUser) throw new Error("User is not signed in.");
  const res = await fetchApi(CLIENT_API_URLS.user.markUserDeleted);
  await handleApiResponse(res);
  await signOut();
}
