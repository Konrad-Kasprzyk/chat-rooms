import auth from "client/db/auth.firebase";
import collections from "client/db/collections.firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { _setSignedInUserId } from "../signedInUserId.utils";
import _createUserDocuments from "./_createUserDocuments.api";

export default async function anonymousSignIn(username: string): Promise<void> {
  if (!username) throw new Error("The username is required to be a non-empty string.");
  let uid: string = "";
  try {
    const credential = await signInAnonymously(auth);
    uid = credential.user.uid;
  } catch (error: any) {
    console.error(error.code);
    console.error(error.message);
  }
  if (!uid) throw new Error("User id is not set after anonymous signing in.");
  if (auth.currentUser?.uid !== uid) return;
  let userDocExists = false;
  try {
    const userDocSnap = await getDoc(doc(collections.users, uid));
    userDocExists = userDocSnap.exists();
  } catch (error: any) {}
  if (auth.currentUser?.uid !== uid) return;
  if (!userDocExists) {
    await _createUserDocuments(username);
  }
  if (auth.currentUser?.uid !== uid) return;
  _setSignedInUserId(uid);
}
