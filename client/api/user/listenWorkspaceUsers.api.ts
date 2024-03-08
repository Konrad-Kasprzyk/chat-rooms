import {
  getOpenWorkspaceId,
  listenOpenWorkspaceIdChanges,
} from "client/api/workspace/openWorkspaceId.utils";
import LISTENER_ERROR_TIMEOUT from "client/constants/listenerErrorTimeout.constant";
import collections from "client/db/collections.firebase";
import mapUserDTO from "client/utils/mappers/mapUserDTO.util";
import sortDocumentStringArrays from "client/utils/other/sortDocumentStringArrays.util";
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
    unsubscribe = createWorkspaceUsersListener(usersSubject, openWorkspaceId);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  usersSubject.next({ docs: [], updates: [] });
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
    .where("workspaceIds", "array-contains", openWorkspaceId)
    .orderBy("username");
  return onSnapshot(
    query,
    (docsSnap) => {
      const docs: User[] = docsSnap.docs.map((docSnap) => mapUserDTO(docSnap.data()));
      const updates: docsSnap<User>["updates"] = docsSnap.docChanges().map((docChange) => ({
        type: docChange.type,
        doc: mapUserDTO(docChange.doc.data()),
      }));
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
