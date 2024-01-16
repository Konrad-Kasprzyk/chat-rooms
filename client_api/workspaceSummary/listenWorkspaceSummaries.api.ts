import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import sortAllDocumentArrays from "client_api/utils/sortAllArrays.util";
import collections from "common/db/collections.firebase";
import User from "common/models/user.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import docsSnap from "common/types/docsSnap.type";
import { FirestoreError, Unsubscribe, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

let currentUserSubscription: Subscription | null = null;
let currentUserDocument: User | null = null;
let workspaceSummariesSubject = new BehaviorSubject<docsSnap<WorkspaceSummary>>({
  docs: [],
  updates: [],
});
let unsubscribe: Unsubscribe | null = null;
let isSubjectError: boolean = false;
let isMainFunctionFirstRun: boolean = true;
/**
 * Skip initial data from the backend from being displayed as newly added documents.
 * Skips updates sent to the subject.
 */
let isSyncedWithBackend: boolean = false;

/**
 * Listens to the workspace summary documents of the signed in user.
 * Sends an empty array if the current user document is not found.
 * Updates the firestore listener when the current user document changes.
 */
export default function listenWorkspaceSummaries(): Observable<docsSnap<WorkspaceSummary>> {
  if (isMainFunctionFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        cancelSubscriptionAndListener();
        workspaceSummariesSubject.complete();
      });
    }
    resetSubscription();
    isMainFunctionFirstRun = false;
  }
  if (isSubjectError) {
    isSubjectError = false;
    resetSubscription();
  }
  workspaceSummariesSubject.value.updates = [];
  return workspaceSummariesSubject.asObservable();
}

/**
 * Cancels the current user document subscription and the firestore listener.
 * Sets all variables associated with the subscription and listener to null.
 */
function cancelSubscriptionAndListener() {
  currentUserDocument = null;
  if (currentUserSubscription) currentUserSubscription.unsubscribe();
  currentUserSubscription = null;
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
}

/**
 * Resets the current user document subscription.
 * Cancels the subscription and the firestore listener and sets all associated variables to null.
 */
function resetSubscription() {
  cancelSubscriptionAndListener();
  workspaceSummariesSubject = new BehaviorSubject<docsSnap<WorkspaceSummary>>({
    docs: [],
    updates: [],
  });
  currentUserSubscription = subscribeCurrentUserListener();
}

/**
 * Sends an error to the subject.
 * Cancels the subscription and the firestore listener and sets all associated variables to null.
 */
function subjectError(errorMessage: string | FirestoreError) {
  isSubjectError = true;
  cancelSubscriptionAndListener();
  workspaceSummariesSubject.error(errorMessage);
}

/**
 * Listen to the current user document.
 * Resets the firestore listener when the current user's document id or email changes.
 * Returns null if the subject error flag is set.
 */
function subscribeCurrentUserListener(): Subscription | null {
  if (isSubjectError) return null;
  return listenCurrentUser().subscribe({
    next: (user) => {
      const oldUserDocument = currentUserDocument;
      currentUserDocument = user;
      if (isSubjectError) return;
      if (!oldUserDocument && !currentUserDocument) return;
      if (
        oldUserDocument?.id == currentUserDocument?.id &&
        oldUserDocument?.email == currentUserDocument?.email
      )
        return;
      renewFirestoreListener();
    },
    error: () => subjectError("Current user listener error."),
  });
}

/**
 * Unsubscribes the active listener. Returns if the subject error flag is set.
 * Creates a new listener if the the signed in user document is not null and is not created from
 * the firebase account data, and links the created listener to the subject.
 * If the current user document is not found, the firestore listener is not created
 * and the new subject value is an empty array.
 */
function renewFirestoreListener() {
  if (unsubscribe) unsubscribe();
  if (isSubjectError) return;
  if (!currentUserDocument || currentUserDocument.dataFromFirebaseAccount) {
    workspaceSummariesSubject.next({ docs: [], updates: [] });
  } else {
    isSyncedWithBackend = false;
    unsubscribe = createWorkspaceSummariesListener(
      workspaceSummariesSubject,
      currentUserDocument.id,
      currentUserDocument.email
    );
  }
}

/**
 * Creates a new workspace summaries firestore listener.
 */
function createWorkspaceSummariesListener(
  subject: BehaviorSubject<docsSnap<WorkspaceSummary>>,
  userId: string,
  userEmail: string
): Unsubscribe {
  const query = collections.workspaceSummaries
    .where("isDeleted", "==", false)
    .or(["userIds", "array-contains", userId], ["invitedUserEmails", "array-contains", userEmail])
    .orderBy("id");
  return onSnapshot(
    query,
    // Listen to the local cache changes. May get duplicate data with metadata changes only.
    // Such as pending writes to the backend and initial data from the cache.
    { includeMetadataChanges: true },
    (docsSnap) => {
      if (isSubjectError) return;
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
          doc: docChange.doc.data(),
        }));
      }
      // Skip initial data from the backend from being displayed as newly added documents.
      else {
        if (!docsSnap.metadata.fromCache) isSyncedWithBackend = true;
      }
      const docs = docsSnap.docs.map((docSnap) => docSnap.data());
      docs.forEach((doc) => sortAllDocumentArrays(doc));
      updates.forEach((update) => sortAllDocumentArrays(update.doc));
      subject.next({
        docs,
        updates,
      });
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => subjectError(error)
  );
}

export const _listenWorkspaceSummariesExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => subjectError("Testing error."),
      }
    : undefined;
