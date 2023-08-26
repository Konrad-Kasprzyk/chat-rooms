import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import { doc, updateDoc } from "firebase/firestore";
import { firstValueFrom } from "rxjs";
import listenCurrentUser from "./listenCurrentUser.api";

/**
 * @throws {string} When the user is not signed in or the user document is not found.
 */
export default async function changeCurrentUserUsername(newUsername: string): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw "User document not found.";
  const uid = auth.currentUser.uid;
  const userRef = doc(collections.users, uid);
  await updateDoc(userRef, { username: newUsername });
}
