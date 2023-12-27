import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import auth from "common/db/auth.firebase";
import { _setSignedInUserId } from "./signedInUserId.utils";

/**
 * Sings out the current user.
 * Sets the signed in user id to null and the open workspace id to null,
 * affecting all listeners to return empty arrays and nulls.
 * @throws {string} When the user is not signed in.
 */
export default async function signOut(): Promise<void> {
  if (!auth.currentUser) throw new Error("The user is not signed in.");
  setOpenWorkspaceId(null);
  _setSignedInUserId(null);
  //TODO clear all indexedDB data
  await auth.signOut();
}
