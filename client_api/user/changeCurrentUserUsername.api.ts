import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import { doc, updateDoc } from "firebase/firestore";

/**
 * @throws {string} When the user is not signed in.
 */
export default async function changeCurrentUserUsername(newUsername: string): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  const uid = auth.currentUser.uid;
  const userRef = doc(collections.users, uid);
  await updateDoc(userRef, { username: newUsername });
}
