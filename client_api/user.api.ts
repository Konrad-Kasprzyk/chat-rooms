import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import { auth, db } from "../db/firebase";
import COLLECTIONS from "../global/constants/collections";
import User from "../global/models/user.model";
import Workspace from "../global/models/workspace.model";
import fetchPost from "../global/utils/fetchPost";
import { getSubject, storeSubscriptions } from "./utils/subscriptions";

export function signInWithGoogle(): string {
  // if user model doesn't exist, create it
  return "user model id";
}

export function signInWithGitHub(): string {
  // if user model doesn't exist, create it
  return "user model id";
}

export function signInWithFacebook(): string {
  // if user model doesn't exist, create it
  return "user model id";
}

export function sendSignInLinkToEmail() {}

export function signInWithEmailLink() {
  // if user model doesn't exist, create it
}

/**
 * Creates user model. It doesn't register a new user.
 * @returns user id
 * @throws {string} When the user is not logged in or the email is empty.
 */
async function createUserModel(email: string, username: string): Promise<string> {
  if (!email) throw "Email is missing.";
  if (!auth.currentUser) throw "User is not logged in.";
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetchPost("api/create-user-model", { idToken, email, username });
  if (res.status !== 201) throw await res.text();
  const userId = res.text();
  return userId;
}

async function deleteCurrentUserUserModel(): Promise<void> {
  if (!auth.currentUser) throw "User is not logged in.";
}

export function deleteCurrentUser(): void {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return null;
}

/**
 * @throws {string} When the user is not logged in.
 */
export function getCurrentUser(): BehaviorSubject<User | null> {
  if (!auth.currentUser) throw "User is not logged in.";
  const uid = auth.currentUser.uid;
  const currentUserSubOrNull = getSubject<"currentUser">({ uid });
  if (currentUserSubOrNull) return currentUserSubOrNull;
  const currentUserSub = new BehaviorSubject<User | null>(null);
  const unsubscribeUser = onSnapshot(doc(db, COLLECTIONS.users, uid), (doc) => {
    if (!doc.exists()) {
      currentUserSub.next(null);
      return;
    }
    const user = doc.data() as User;
    currentUserSub.next(user);
  });
  storeSubscriptions<"currentUser">({ uid }, [unsubscribeUser], currentUserSub);
  return currentUserSub;
}

export function getWorkspaceUsers(workspace: BehaviorSubject<Workspace>): BehaviorSubject<User[]> {
  return null;
}

/**
 * @throws {string} When the user is not logged in.
 */
export async function changeCurrentUserUsername(newUsername: string): Promise<void> {
  if (!auth.currentUser) throw "User is not logged in.";
  const uid = auth.currentUser.uid;
  const userRef = doc(db, COLLECTIONS.users, uid);
  await updateDoc(userRef, { username: newUsername });
}

export const exportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        createUserModel,
      }
    : {};
