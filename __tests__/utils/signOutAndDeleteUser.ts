import { adminAuth } from "../../global/db/firebase-admin";
import { auth } from "../../global/db/firebase";

export default async function signOutAndDeleteUser(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const userUid = user.uid;
  await auth.signOut();
  await adminAuth.deleteUser(userUid);
}
