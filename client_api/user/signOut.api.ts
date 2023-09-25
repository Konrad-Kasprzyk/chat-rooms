import auth from "common/db/auth.firebase";
import { _setSignedInUserId } from "./signedInUserId.utils";

/**
 * The signOut function signs out the current user and removes all firestore listeners
 * and RxJS subscriptions.
 * @throws {string} When the user is not signed in.
 */
export default async function signOut(): Promise<void> {
  if (!auth.currentUser) throw new Error("User is not signed in.");
  _setSignedInUserId(null);
  //TODO clear all indexedDB data
  await auth.signOut();
}
