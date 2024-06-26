import auth from "client/db/auth.firebase";
import collections from "client/db/collections.firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { _setSignedInUserId } from "../signedInUserId.utils";
import _createUserDocuments from "./_createUserDocuments.api";

export default async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  let uid: string = "";
  let displayName: string | null = "";
  try {
    const credential = await signInWithPopup(auth, provider);
    uid = credential.user.uid;
    displayName = credential.user.displayName;
  } catch (error: any) {
    console.error(error.code);
    console.error(error.message);
  }
  if (!uid) throw new Error("User id is not set after signing in with Google.");
  if (auth.currentUser?.uid !== uid) throw new Error("User uid changed during sign in.");
  let userDocExists = false;
  try {
    const userDocSnap = await getDoc(doc(collections.users, uid));
    userDocExists = userDocSnap.exists();
  } catch (error: any) {}
  if (auth.currentUser?.uid !== uid) throw new Error("User uid changed during sign in.");
  if (!userDocExists) {
    const username: string = displayName || uid;
    await _createUserDocuments(username);
  }
  if (auth.currentUser?.uid !== uid) throw new Error("User uid changed during sign in.");
  _setSignedInUserId(uid);
}
