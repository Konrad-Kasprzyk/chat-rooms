import auth from "client/db/auth.firebase";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import signOut from "./signOut.api";

/**
 * Deletes signed in user documents and linked bots documents. Deletes the user firebase account.
 * Deletes the user account even if the user document is not found  Signs out the user after the
 * operations.
 * @throws {Error} When the user is not signed in.
 */
export default async function deleteUserDocumentsAndAccount(): Promise<void> {
  if (!auth.currentUser) throw new Error("The user is not signed in.");
  const res = await fetchApi(CLIENT_API_URLS.user.deleteUserDocumentsAndAccount);
  await handleApiResponse(res);
  await signOut();
}
