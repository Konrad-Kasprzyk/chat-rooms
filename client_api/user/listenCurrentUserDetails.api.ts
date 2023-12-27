import sortAllDocumentArrays from "client_api/utils/sortAllArrays.util";
import collections from "common/db/collections.firebase";
import UserDetails from "common/models/userDetails.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getSignedInUserId, listenSignedInUserIdChanges } from "./signedInUserId.utils";

let userDetailsSubject = new BehaviorSubject<UserDetails | null>(null);
let unsubscribe: Unsubscribe | null = null;
let isSubjectError: boolean = false;
let isMainFunctionFirstRun: boolean = true;

/**
 * Listens for the signed in user details document.
 * Sends a null if the user is not signed in or the user document has the deleted flag set.
 * Updates the listener when the singed in user id changes.
 */
export default function listenCurrentUserDetails(): Observable<UserDetails | null> {
  if (isMainFunctionFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (unsubscribe) unsubscribe();
        if (!isSubjectError) userDetailsSubject.complete();
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
    userDetailsSubject = new BehaviorSubject<UserDetails | null>(null);
    isSubjectError = false;
    renewFirestoreListener();
  }
  return userDetailsSubject.asObservable();
}

/**
 * Unsubscribes the active listener. Creates the new firestore listener if the id of the signed in user
 * is found and links created listener with the subject. Otherwise sends null as the new subject value.
 */
function renewFirestoreListener() {
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  if (!uid) {
    userDetailsSubject.next(null);
  } else {
    unsubscribe = createCurrentUserDetailsListener(userDetailsSubject, uid);
  }
}

function createCurrentUserDetailsListener(
  subject: BehaviorSubject<UserDetails | null>,
  uid: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.userDetails, uid),
    (userDetailsSnap) => {
      if (isSubjectError) return;
      const userDetails = userDetailsSnap.data();
      if (!userDetails) {
        subject.next(null);
        return;
      }
      sortAllDocumentArrays(userDetails);
      subject.next(userDetails);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      isSubjectError = true;
      subject.error(error);
    }
  );
}

export const _listenCurrentUserDetailsExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          isSubjectError = true;
          userDetailsSubject.error("Testing error.");
        },
      }
    : undefined;
