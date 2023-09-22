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
 * Creates new subject and listener for the signed in user.
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
      renewListener();
    });
    renewListener();
    isMainFunctionFirstRun = false;
  }
  if (isSubjectError) {
    userSubject = new BehaviorSubject<User | null>(null);
    isSubjectError = false;
    renewListener();
  }
  return userSubject.asObservable();
}

/**
 * Unsubscribes active listener. Creates the new listener if the id of a signed in user is found
 * and links created listener with subject. Otherwise sends null as the new subject value.
 */
function renewListener() {
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
      if (!userSnap.exists()) {
        subject.next(null);
        return;
      }
      const user = userSnap.data();
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
