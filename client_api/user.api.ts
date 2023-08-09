import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import User from "common/models/user.model";
import { Collections, auth } from "db/client/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import {
  getSubjectFromSubsSubjectPack,
  removeAllSubsSubjectPacks,
  removeSubsSubjectPack,
  saveAndAppendSubsSubjectPack,
} from "./utils/subscriptions.utils";

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
 * The signOut function signs out the current user and removes all firestore listeners
 * and RxJS subscriptions.
 * @throws {string} When the user is not signed in.
 */
export async function signOut(): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  await auth.signOut();
  removeAllSubsSubjectPacks();
}

/**
 * Creates user model. It doesn't register a new user.
 * @returns user id
 * @throws {string} When the user is not signed in.
 */
async function createUserModel(username: string): Promise<string> {
  if (!auth.currentUser) throw "User is not signed in.";
  const res = await fetchApi(API_URLS.user.createUserModel, { username });
  if (!res.ok) throw await res.text();
  const userId = res.text();
  return userId;
}

export async function deleteCurrentUser(): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  const res = await fetchApi(API_URLS.user.deleteUser);
  if (!res.ok) throw await res.text();
  return signOut();
}

/**
 * @throws {string} When the user is not signed in.
 */
export function getCurrentUser(): BehaviorSubject<User | null> {
  if (!auth.currentUser) throw "User is not signed in.";
  const uid = auth.currentUser.uid;
  const currentUserSubjectOrNull = getSubjectFromSubsSubjectPack<"currentUser">("currentUser", {
    uid,
  });
  if (currentUserSubjectOrNull) return currentUserSubjectOrNull;
  const currentUserSubject = new BehaviorSubject<User | null>(null);
  const unsubscribeUser = onSnapshot(
    doc(Collections.users, uid),
    (userSnap) => {
      if (!userSnap.exists()) {
        currentUserSubject.next(null);
        return;
      }
      const user = userSnap.data();
      currentUserSubject.next(user);
    },
    (_error) => {
      currentUserSubject.error(_error.message);
      removeSubsSubjectPack<"currentUser">("currentUser", {
        uid,
      });
    }
  );
  saveAndAppendSubsSubjectPack<"currentUser">(
    "currentUser",
    { uid },
    [unsubscribeUser],
    currentUserSubject
  );
  return currentUserSubject;
}

export function getWorkspaceUsers(workspaceId: string): BehaviorSubject<User[]> {
  const workspaceUsersSubjectOrNull = getSubjectFromSubsSubjectPack<"users">("users", {
    workspaceId,
  });
  if (workspaceUsersSubjectOrNull) return workspaceUsersSubjectOrNull;
  const workspaceUsersSubject = new BehaviorSubject<User[]>([]);
  const workspaceUsersQuery = Collections.users.where(
    "workspaceIds",
    "array-contains",
    workspaceId
  );
  const unsubscribeWorkspaceUsers = onSnapshot(
    workspaceUsersQuery,
    (usersSnap) => {
      if (usersSnap.empty) {
        workspaceUsersSubject.next([]);
        return;
      }
      const users: User[] = [];
      for (const userSnap of usersSnap.docs) users.push(userSnap.data());
      workspaceUsersSubject.next(users);
    },
    (_error) => {
      workspaceUsersSubject.error(_error.message);
      removeSubsSubjectPack<"users">("users", {
        workspaceId,
      });
    }
  );
  saveAndAppendSubsSubjectPack<"users">(
    "users",
    { workspaceId },
    [unsubscribeWorkspaceUsers],
    workspaceUsersSubject
  );
  return workspaceUsersSubject;
}

/**
 * @throws {string} When the user is not signed in.
 */
export function changeCurrentUserUsername(newUsername: string): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  const uid = auth.currentUser.uid;
  const userRef = doc(Collections.users, uid);
  return updateDoc(userRef, { username: newUsername });
}

export const exportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        createUserModel,
      }
    : {};
