import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client_api/user/signedInUserId.utils";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import {
  getOpenWorkspaceId,
  listenOpenWorkspaceIdChanges,
} from "client_api/workspace/openWorkspaceId.utils";
import User from "common/models/user.model";
import docsSnap from "common/types/docsSnap.type";
import { FirestoreError } from "firebase/firestore";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import _getWorkspaceUsersFromFirestore from "./_getWorkspaceUsersFromFirestore.util";
import _listenWorkspaceUsersChanges from "./_listenWorkspaceUsersChanges.util";

let openWorkspaceSubscription: Subscription | null = null;
let workspaceUsersChangesSubscription: Subscription | null = null;
let usersSubject = new BehaviorSubject<docsSnap<User>>({ docs: [], updates: [] });
let users: User[] = [];
let isSubjectError: boolean = false;
let isFetchingDocs: boolean = true;
let isMainFunctionFirstRun: boolean = true;

export default function listenWorkspaceUsers(): Observable<docsSnap<User>> {
  if (isMainFunctionFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (!isSubjectError) usersSubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe((uid) => {
      if (isSubjectError) return;
      if (!uid) {
        users = [];
        usersSubject.next({ docs: [], updates: [] });
        return;
      }
      syncUsersWithFirestore();
    });
    listenOpenWorkspaceIdChanges().subscribe((openWorkspaceId) => {
      if (isSubjectError) return;
      if (!openWorkspaceId) {
        users = [];
        usersSubject.next({ docs: [], updates: [] });
        return;
      }
      syncUsersWithFirestore();
    });
    openWorkspaceSubscription = subscribeOpenWorkspaceListener();
    workspaceUsersChangesSubscription = subscribeWorkspaceUsersChanges();
    syncUsersWithFirestore();
    isMainFunctionFirstRun = false;
  }
  if (isSubjectError) {
    usersSubject = new BehaviorSubject<docsSnap<User>>({ docs: [], updates: [] });
    isSubjectError = false;
    isFetchingDocs = true;
    if (openWorkspaceSubscription) openWorkspaceSubscription.unsubscribe();
    openWorkspaceSubscription = subscribeOpenWorkspaceListener();
    if (workspaceUsersChangesSubscription) workspaceUsersChangesSubscription.unsubscribe();
    workspaceUsersChangesSubscription = subscribeWorkspaceUsersChanges();
    syncUsersWithFirestore();
  }
  return usersSubject.asObservable();
}

async function syncUsersWithFirestore() {
  if (!getSignedInUserId() || !getOpenWorkspaceId()) {
    users = [];
    usersSubject.next({ docs: [], updates: [] });
    isFetchingDocs = false;
    return;
  }
  isFetchingDocs = true;
  // TODO get user docs from indexedDB.
  /**
   * Get the latest modification time of the users documents and fetch all users who were modified
   * after this date. If no users documents are found, fetch all users. If the open workspace
   * doesn't contain some users that are present in the cache, update them in the indexedDB.
   * Update their workspace ids list where they belong, but don't update their modification time.
   */
  users = [];
  const freshUsers = await _getWorkspaceUsersFromFirestore();
  // Users removed from the workspace are not fetched, so only modified and added users should be updated.
  updateModifiedAndAddedUsers(freshUsers);
  usersSubject.next({ docs: users, updates: [] });
  isFetchingDocs = false;
}

/**
 * If the open workspace doesn't have some users belonging to it, but they are loaded as workspace
 * users, remove them from the cache. Then send updates trough usersSubject. Update those documents inside indexedDB.
 */
function subscribeOpenWorkspaceListener(): Subscription {
  return listenOpenWorkspace().subscribe({
    next: (workspace) => {
      if (!workspace) return;
      const userIdsToRemove: string[] = [];
      for (const user of users) {
        if (workspace.userIds.includes(user.id)) continue;
        userIdsToRemove.push(user.id);
      }
      const updates: docsSnap<User>["updates"] = [];
      for (const userIdToRemove of userIdsToRemove) {
        const idx = users.findIndex((u) => u.id === userIdToRemove);
        updates.push({ type: "removed", doc: users[idx] });
        users.splice(idx, 1);
      }

      // TODO update user docs from indexedDB.
      /**
       * Update their workspace ids list where they belong, but don't update their modification time.
       * This way users not belonging to current open workspace won't be retrieved from indexedDB and
       * modification time is not changed, as documents are not fetched from the firestore.
       */

      // Users are already sorted, because this subscription only removes users.
      sortUpdates(updates);
      if (!isFetchingDocs && !isSubjectError && updates.length) {
        usersSubject.next({
          docs: users,
          updates: updates,
        });
      }
    },
    error: () => {
      isSubjectError = true;
      usersSubject.error("Open workspace listener error.");
    },
  });
}

function subscribeWorkspaceUsersChanges() {
  return _listenWorkspaceUsersChanges().subscribe({
    next: (modifiedUsersChanges) => {
      if (!modifiedUsersChanges.length) return;
      // Users removed from the open workspace are handled in subscribeOpenWorkspaceListener function.
      const modifiedAndAddedUsers = modifiedUsersChanges
        .filter((userChange) => userChange.type !== "removed")
        .map((userChange) => userChange.doc);
      const updates = updateModifiedAndAddedUsers(modifiedAndAddedUsers);
      sortUpdates(updates);
      if (!isFetchingDocs && !isSubjectError && updates.length)
        usersSubject.next({
          docs: users,
          updates: updates,
        });
    },
    error: (error: FirestoreError) => {
      isSubjectError = true;
      usersSubject.error(error);
    },
  });
}

/**
 * Updates the loaded documents array with the modified user documents and returns
 * the update array with the appropriate update type.
 *
 * If the modified document is not present in the loaded documents array, its update type is 'added'.
 *
 * If the modified document is present in the loaded documents array and has a newer modification
 * date, its update type is 'modified'.
 */
function updateModifiedAndAddedUsers(modifiedUsers: User[]): docsSnap<User>["updates"] {
  const updates: docsSnap<User>["updates"] = [];
  for (const modifiedUser of modifiedUsers) {
    const idx = users.findIndex((u) => u.id === modifiedUser.id);
    if (idx > -1) {
      if (modifiedUser.modificationTime > users[idx].modificationTime) {
        users[idx] = modifiedUser;
        updates.push({ type: "modified", doc: modifiedUser });
      }
    } else {
      users.push(modifiedUser);
      updates.push({ type: "added", doc: modifiedUser });
    }
  }
  sortUsers();
  return updates;
}

function sortUsers() {
  users.sort((u1, u2) => {
    if (u1.username < u2.username) return -1;
    if (u1.username === u2.username) return 0;
    return 1;
  });
}

function sortUpdates(updates: docsSnap<User>["updates"]) {
  updates.sort((u1, u2) => {
    if (u1.doc.username < u2.doc.username) return -1;
    if (u1.doc.username === u2.doc.username) return 0;
    return 1;
  });
}
