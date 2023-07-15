import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import COLLECTIONS from "common/constants/collections.constant";
import User from "common/models/user.model";
import { auth, db } from "db/firebase";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import {
  getSubjectFromSubsSubjectPack,
  removeAllSubsSubjectPacks,
  removeSubsSubjectPack,
  saveAndReplaceSubsSubjectPack,
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
    doc(db, COLLECTIONS.users, uid),
    (userSnap) => {
      if (!userSnap.exists()) {
        currentUserSubject.next(null);
        return;
      }
      const user = userSnap.data() as User;
      currentUserSubject.next(user);
    },
    (_error) => {
      currentUserSubject.error(_error.message);
      removeSubsSubjectPack<"currentUser">("currentUser", {
        uid,
      });
    }
  );
  saveAndReplaceSubsSubjectPack<"currentUser">(
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
  const workspaceUsersQuery = query(
    collection(db, COLLECTIONS.users),
    where(
      "workspaceIds" satisfies keyof User,
      "array-contains",
      workspaceId satisfies User["workspaceIds"][number]
    )
  );
  const unsubscribeWorkspaceUsers = onSnapshot(
    workspaceUsersQuery,
    (usersSnap) => {
      if (usersSnap.empty) {
        workspaceUsersSubject.next([]);
        return;
      }
      const users: User[] = [];
      for (const userSnap of usersSnap.docs) users.push(userSnap.data() as User);
      workspaceUsersSubject.next(users);
    },
    (_error) => {
      workspaceUsersSubject.error(_error.message);
      removeSubsSubjectPack<"users">("users", {
        workspaceId,
      });
    }
  );
  saveAndReplaceSubsSubjectPack<"users">(
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
  const userRef = doc(db, COLLECTIONS.users, uid);
  return updateDoc(userRef, { username: newUsername } satisfies Partial<User>);
}

export const exportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        createUserModel,
      }
    : {};
