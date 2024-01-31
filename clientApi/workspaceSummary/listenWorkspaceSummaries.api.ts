import LISTENER_ERROR_TIMEOUT from "clientApi/constants/listenerErrorTimeout.constant";
import collections from "clientApi/db/collections.firebase";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "clientApi/user/signedInUserId.utils";
import mapWorkspaceSummaryDTO from "clientApi/utils/mappers/mapWorkspaceSummaryDTO.util";
import sortDocumentStringArrays from "clientApi/utils/other/sortDocumentStringArrays.util";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import docsSnap from "common/types/docsSnap.type";
import { FirestoreError, Unsubscribe, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";

let workspaceSummariesSubject = new BehaviorSubject<docsSnap<WorkspaceSummary>>({
  docs: [],
  updates: [],
});
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;
/**
 * Skip initial data from the backend from being displayed as newly added documents.
 * Skips updates sent to the subject.
 */
let isSyncedWithBackend: boolean = false;

/**
 * Listens to the workspace summary documents of the signed in user.
 * Sends an empty array if the signed in user id is not found.
 * Updates the firestore listener when the singed in user id changes.
 */
export default function listenWorkspaceSummaries(): Observable<docsSnap<WorkspaceSummary>> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        workspaceSummariesSubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    renewFirestoreListener();
    isFirstRun = false;
  }
  workspaceSummariesSubject.value.updates = [];
  return workspaceSummariesSubject.asObservable();
}

/**
 * Unsubscribes the active listener. Creates a new listener if the id of the signed in user is
 * found. If the id of the signed in user is not found, the firestore listener is not created and
 * the new subject value is an empty array. If the timeout to renew the firestore listener is
 * active, it will be cancelled.
 */
function renewFirestoreListener() {
  if (renewListenerTimeout) {
    clearTimeout(renewListenerTimeout);
    renewListenerTimeout = null;
  }
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  if (!uid) {
    workspaceSummariesSubject.next({ docs: [], updates: [] });
  } else {
    isSyncedWithBackend = false;
    unsubscribe = createWorkspaceSummariesListener(workspaceSummariesSubject, uid);
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
 * Creates a new workspace summaries firestore listener.
 */
function createWorkspaceSummariesListener(
  subject: BehaviorSubject<docsSnap<WorkspaceSummary>>,
  userId: string
): Unsubscribe {
  const query = collections.workspaceSummaries
    .where("isDeleted", "==", false)
    .or(["userIds", "array-contains", userId], ["invitedUserIds", "array-contains", userId])
    .orderBy("id");
  return onSnapshot(
    query,
    // Listen to the local cache changes. May get duplicate data with metadata changes only.
    // Such as pending writes to the backend and initial data from the cache.
    { includeMetadataChanges: true },
    (docsSnap) => {
      let updates: docsSnap<WorkspaceSummary>["updates"] = [];
      // Don't show pending writes to the backend and initial data from the cache as updates.
      // Updates should be shown as already synced with the backend.
      if (
        isSyncedWithBackend &&
        !docsSnap.metadata.hasPendingWrites &&
        !docsSnap.metadata.fromCache
      ) {
        updates = docsSnap.docChanges().map((docChange) => ({
          type: docChange.type,
          doc: mapWorkspaceSummaryDTO(docChange.doc.data()),
        }));
      }
      // Skip initial data from the backend from being displayed as newly added documents.
      else {
        if (!docsSnap.metadata.fromCache) isSyncedWithBackend = true;
      }
      const docs: WorkspaceSummary[] = docsSnap.docs.map((docSnap) =>
        mapWorkspaceSummaryDTO(docSnap.data())
      );
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

export const _listenWorkspaceSummariesExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
      }
    : undefined;
