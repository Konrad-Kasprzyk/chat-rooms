import SubsSubjectPack from "client_api/utils/subsSubjectPack.class";
import { auth } from "db/client/firebase";

/**
 * The signOut function signs out the current user and removes all firestore listeners
 * and RxJS subscriptions.
 * @throws {string} When the user is not signed in.
 */
export default async function signOut(): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  await auth.signOut();
  SubsSubjectPack.removeAllSubsSubjectPacks();
}
