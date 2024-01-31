import LISTENER_ERROR_TIMEOUT from "clientApi/constants/listenerErrorTimeout.constant";
import collections from "clientApi/db/collections.firebase";
import mapUserDTO from "clientApi/utils/mappers/mapUserDTO.util";
import sortDocumentStringArrays from "clientApi/utils/other/sortDocumentStringArrays.util";
import {
  getOpenWorkspaceId,
  listenOpenWorkspaceIdChanges,
} from "clientApi/workspace/openWorkspaceId.utils";
import User from "common/clientModels/user.model";
import docsSnap from "common/types/docsSnap.type";
import { FirestoreError, Unsubscribe, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getSignedInUserId, listenSignedInUserIdChanges } from "./signedInUserId.utils";

let usersSubject = new BehaviorSubject<docsSnap<User>>({ docs: [], updates: [] });
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;
/**
 * Skip initial data from the backend from being displayed as newly added documents.
 * Skips updates sent to the subject.
 */
let isSyncedWithBackend: boolean = false;

/**
 * Listens all user documents for the open workspace.
 * Sends an empty array if the user is not signed in or no workspace is open.
 * Updates the firestore listener when the singed in user id or the open workspace id changes.
 */
export default function listenWorkspaceUsers(): Observable<docsSnap<User>> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        usersSubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    listenOpenWorkspaceIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    renewFirestoreListener();
    isFirstRun = false;
  }
  usersSubject.value.updates = [];
  return usersSubject.asObservable();
}

/**
 * Unsubscribes the active listener. Creates a new listener if both the ids of the signed in user
 * and the open workspace are found, and links the created listener to the subject.
 * If the user is not signed in or no workspace is open, the firestore listener is not created
 * and the new subject value is an empty array.
 * If the timeout to renew the firestore listener is active, it will be cancelled.
 */
function renewFirestoreListener() {
  if (renewListenerTimeout) {
    clearTimeout(renewListenerTimeout);
    renewListenerTimeout = null;
  }
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  const openWorkspaceId = getOpenWorkspaceId();
  if (!uid || !openWorkspaceId) {
    usersSubject.next({ docs: [], updates: [] });
  } else {
    isSyncedWithBackend = false;
    unsubscribe = createWorkspaceUsersListener(usersSubject, openWorkspaceId);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  renewListenerTimeout = setTimeout(() => {
    renewListenerTimeout = null;
    renewFirestoreListener();
  }, LISTENER_ERROR_TIMEOUT);
}

/**
 * Creates a new workspace users firestore listener.
 */
function createWorkspaceUsersListener(
  subject: BehaviorSubject<docsSnap<User>>,
  openWorkspaceId: string
): Unsubscribe {
  const query = collections.users
    .where("isDeleted", "==", false)
    .where("workspaceIds", "array-contains", openWorkspaceId)
    .orderBy("username");
  return onSnapshot(
    query,
    // Listen to the local cache changes. May get duplicate data with metadata changes only.
    // Such as pending writes to the backend and initial data from the cache.
    { includeMetadataChanges: true },
    (docsSnap) => {
      let updates: docsSnap<User>["updates"] = [];
      // Don't show pending writes to the backend and initial data from the cache as updates.
      // Updates should be shown as already synced with the backend.
      if (
        isSyncedWithBackend &&
        !docsSnap.metadata.hasPendingWrites &&
        !docsSnap.metadata.fromCache
      ) {
        updates = docsSnap.docChanges().map((docChange) => ({
          type: docChange.type,
          doc: mapUserDTO(docChange.doc.data()),
        }));
      }
      // Skip initial data from the backend from being displayed as newly added documents.
      else {
        if (!docsSnap.metadata.fromCache) isSyncedWithBackend = true;
      }
      const docs: User[] = docsSnap.docs.map((docSnap) => mapUserDTO(docSnap.data()));
      docs.forEach((doc) => sortDocumentStringArrays(doc));
      updates.forEach((update) => sortDocumentStringArrays(update.doc));
      subject.next({
        docs,
        updates,
      });
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      listenerError();
    }
  );
}

export const _listenWorkspaceUsersExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
      }
    : undefined;
