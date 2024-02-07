import LISTENER_ERROR_TIMEOUT from "client/constants/listenerErrorTimeout.constant";
import collections from "client/db/collections.firebase";
import mapUserDetailsDTO from "client/utils/mappers/mapUserDetailsDTO.util";
import sortDocumentStringArrays from "client/utils/other/sortDocumentStringArrays.util";
import UserDetails from "common/clientModels/userDetails.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getSignedInUserId, listenSignedInUserIdChanges } from "./signedInUserId.utils";

let userDetailsSubject = new BehaviorSubject<UserDetails | null>(null);
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;

/**
 * Listens for the signed in user details document.
 * Sends a null if the user is not signed in or the document has the deleted flag set.
 * Updates the listener when the singed in user id changes.
 */
export default function listenCurrentUserDetails(): Observable<UserDetails | null> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        userDetailsSubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    renewFirestoreListener();
    isFirstRun = false;
  }
  return userDetailsSubject.asObservable();
}

/**
 * Unsubscribes the active listener. Creates the new firestore listener if the id of the signed in user
 * is found and links created listener with the subject. Otherwise sends null as the new subject value.
 * If the timeout to renew the firestore listener is active, it will be cancelled.
 */
function renewFirestoreListener() {
  if (renewListenerTimeout) {
    clearTimeout(renewListenerTimeout);
    renewListenerTimeout = null;
  }
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  if (!uid) {
    userDetailsSubject.next(null);
  } else {
    unsubscribe = createCurrentUserDetailsListener(userDetailsSubject, uid);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  userDetailsSubject.next(null);
  renewListenerTimeout = setTimeout(() => {
    renewListenerTimeout = null;
    renewFirestoreListener();
  }, LISTENER_ERROR_TIMEOUT);
}

function createCurrentUserDetailsListener(
  subject: BehaviorSubject<UserDetails | null>,
  uid: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.userDetails, uid),
    (userDetailsSnap) => {
      const userDetailsDTO = userDetailsSnap.data();
      if (!userDetailsDTO || userDetailsDTO.isDeleted) {
        subject.next(null);
        return;
      }
      const userDetails = mapUserDetailsDTO(userDetailsDTO);
      sortDocumentStringArrays(userDetails);
      subject.next(userDetails);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      listenerError();
    }
  );
}

export const _listenCurrentUserDetailsExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
      }
    : undefined;
