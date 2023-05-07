import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { BehaviorSubject, pairwise, Subscription } from "rxjs";
import { auth, db } from "../db/firebase";
import COLLECTIONS from "../global/constants/collections";
import User from "../global/models/user.model";
import Workspace from "../global/models/workspace.model";
import fetchPost from "../global/utils/fetchPost";
import {
  getSubjectFromSubsSubjectPack,
  removeOnlyFirestoreSubscriptionsFromSubsSubjectPack,
  removeSubsSubjectPack,
  saveAndReplaceSubsSubjectPack,
} from "./utils/subscriptions";

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
  const res = await fetchPost("api/create-user-model", { email, username });
  if (!res.ok) throw await res.text();
  const userId = res.text();
  return userId;
}

export async function deleteCurrentUser(): Promise<void> {
  if (!auth.currentUser) throw "User is not logged in.";
  const res = await fetchPost("api/delete-user-data");
  if (!res.ok) throw await res.text();
  await auth.currentUser.delete();
}

/**
 * @throws {string} When the user is not logged in.
 */
export function getCurrentUser(): BehaviorSubject<User | null> {
  if (!auth.currentUser) throw "User is not logged in.";
  const uid = auth.currentUser.uid;
  const currentUserSubjectOrNull = getSubjectFromSubsSubjectPack<"currentUser">({ uid });
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
      currentUserSubject.next(null);
      removeSubsSubjectPack<"currentUser">({ uid });
    }
  );
  saveAndReplaceSubsSubjectPack<"currentUser">({ uid }, [unsubscribeUser], currentUserSubject);
  return currentUserSubject;
}

/**
 * Creates firestore snapshot listeners for workspace users with linked rxjs subject.
 * Saves nad replaces these as SubsSubjectPack.
 */
function _createOrReplaceWorkspaceUsersSubsSubjectPack(
  workspace: Workspace,
  workspaceUsersSubject: BehaviorSubject<User[]>
) {
  const workspaceUsersQuery = query(
    collection(db, COLLECTIONS.users),
    where("workspaces", "array-contains", {
      id: workspace.id,
      title: workspace.title,
      description: workspace.description,
    })
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
      workspaceUsersSubject.next([]);
      removeSubsSubjectPack<"users">({ workspaceId: workspace.id });
    }
  );
  saveAndReplaceSubsSubjectPack<"users">(
    { workspaceId: workspace.id },
    [unsubscribeWorkspaceUsers],
    workspaceUsersSubject
  );
  return workspaceUsersSubject;
}

/**
 * Listen for changes in the title or description of the workspace and
 * whether the workspace has become null. Replaces firestore listeners and emits
 * new value to workspace users subject.
 */
const subscribedWorkspaceSubjects: {
  workspaceId: string;
  workspaceSubjectSubscription: Subscription;
}[] = [];
/**
 * When provided workspaceSubject's workspace changes title or description, it updates
 * firestore query and emits users. When workspaceSubject's workspace becomes null, it
 * emits an empty array.
 * @throws {string} When at time of invoking function workspaceSubject's workspace is null.
 * When the user is not signed in or does not belong to workspace.
 */
export function getWorkspaceUsers(
  workspaceSubject: BehaviorSubject<Workspace | null>
): BehaviorSubject<User[]> {
  if (!auth.currentUser) throw "User is not logged in.";
  const uid = auth.currentUser.uid;
  const workspace = workspaceSubject.value;
  if (!workspace) throw "Provided workspace subject returned null.";
  if (!workspace.userIds.some((id) => id === uid))
    throw "Signed in user doesn't belong to the workspace with id " + workspace.id;
  const workspaceUsersSubjectOrNull = getSubjectFromSubsSubjectPack<"users">({
    workspaceId: workspace.id,
  });
  const workspaceUsersSubject = workspaceUsersSubjectOrNull
    ? workspaceUsersSubjectOrNull
    : _createOrReplaceWorkspaceUsersSubsSubjectPack(workspace, new BehaviorSubject<User[]>([]));

  // Always create new workspace subject which updates
  // firestore query when title or description changes.
  const subscribedWorkspaceSubjectIndex = subscribedWorkspaceSubjects.findIndex(
    (sub) => sub.workspaceId === workspace.id
  );
  if (subscribedWorkspaceSubjectIndex >= 0) {
    subscribedWorkspaceSubjects[
      subscribedWorkspaceSubjectIndex
    ].workspaceSubjectSubscription.unsubscribe();
    subscribedWorkspaceSubjects.splice(subscribedWorkspaceSubjectIndex, 1);
  }
  const workspaceSubjectSubscription = workspaceSubject
    // Run function only for second and further emits, because it is only for detecting changes.
    .pipe(pairwise())
    .subscribe(([prevWorkspace, nextWorkspace]) => {
      if (
        prevWorkspace != null &&
        nextWorkspace != null &&
        prevWorkspace.title === nextWorkspace.title &&
        prevWorkspace.description === nextWorkspace.description
      )
        return;
      const workspaceUsersSubject = removeOnlyFirestoreSubscriptionsFromSubsSubjectPack<"users">({
        workspaceId: workspace.id,
      });
      if (!workspaceUsersSubject) return;
      if (!nextWorkspace) {
        workspaceUsersSubject.next([]);
        return;
      }
      _createOrReplaceWorkspaceUsersSubsSubjectPack(nextWorkspace, workspaceUsersSubject);
    });
  subscribedWorkspaceSubjects.push({
    workspaceId: workspace.id,
    workspaceSubjectSubscription: workspaceSubjectSubscription,
  });
  return workspaceUsersSubject;
}

/**
 * @throws {string} When the user is not logged in.
 */
export function changeCurrentUserUsername(newUsername: string): Promise<void> {
  if (!auth.currentUser) throw "User is not logged in.";
  const uid = auth.currentUser.uid;
  const userRef = doc(db, COLLECTIONS.users, uid);
  return updateDoc(userRef, { username: newUsername });
}

export const exportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        createUserModel,
      }
    : {};
