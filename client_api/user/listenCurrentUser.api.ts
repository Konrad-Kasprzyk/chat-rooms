import sortAllDocumentArrays from "client_api/utils/sortAllArrays.util";
import collections from "common/db/collections.firebase";
import User from "common/models/user.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getSignedInUserId, listenSignedInUserIdChanges } from "./signedInUserId.utils";

let userSubject = new BehaviorSubject<User | null>(null);
let unsubscribe: Unsubscribe | null = null;
let isSubjectError: boolean = false;
let isMainFunctionFirstRun: boolean = true;

/**
 * Listens for the signed in user document.
 * Sends a null if the user is not signed in or the user document has the deleted flag set.
 * Updates the listener when the singed in user id changes.
 */
export default function listenCurrentUser(): Observable<User | null> {
  if (isMainFunctionFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (unsubscribe) unsubscribe();
        if (!isSubjectError) userSubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      if (isSubjectError) return;
      renewFirestoreListener();
    });
    renewFirestoreListener();
    isMainFunctionFirstRun = false;
  }
  if (isSubjectError) {
    userSubject = new BehaviorSubject<User | null>(null);
    isSubjectError = false;
    renewFirestoreListener();
  }
  return userSubject.asObservable();
}

/**
 * Unsubscribes the active listener. Creates the new firestore listener if the id of the signed in user
 * is found and links created listener with the subject. Otherwise sends null as the new subject value.
 */
function renewFirestoreListener() {
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  if (!uid) {
    userSubject.next(null);
  } else {
    unsubscribe = createCurrentUserListener(userSubject, uid);
  }
}

function createCurrentUserListener(
  subject: BehaviorSubject<User | null>,
  uid: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.users, uid),
    (userSnap) => {
      if (isSubjectError) return;
      const user = userSnap.data();
      if (!user || user.isDeleted) {
        subject.next(null);
        return;
      }
      sortAllDocumentArrays(user);
      subject.next(user);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      isSubjectError = true;
      subject.error(error);
    }
  );
}

export const _listenCurrentUserExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          isSubjectError = true;
          userSubject.error("Testing error.");
        },
      }
    : undefined;
