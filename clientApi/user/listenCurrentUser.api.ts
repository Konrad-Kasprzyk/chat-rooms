import LISTENER_ERROR_TIMEOUT from "clientApi/constants/listenerErrorTimeout.constant";
import collections from "clientApi/db/collections.firebase";
import mapUserDTO from "clientApi/utils/mappers/mapUserDTO.util";
import sortDocumentStringArrays from "clientApi/utils/other/sortDocumentStringArrays.util";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import User from "common/clientModels/user.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import signOut from "./signOut.api";
import { getSignedInUserId, listenSignedInUserIdChanges } from "./signedInUserId.utils";

let userSubject = new BehaviorSubject<User | null>(null);
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;
let signedInUserIdChangesSubscription: Subscription | null = null;

/**
 * Listens for the signed in user document. Sends a null if the user is not signed in or the user
 * document has the deleted flag set. Updates the listener when the singed in user id changes.
 * Sets the open workspace id to null if the user does not belong to the open workspace.
 * If the user document does not exist, the user will be signed out.
 */
export default function listenCurrentUser(): Observable<User | null> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        userSubject.complete();
      });
    }
    signedInUserIdChangesSubscription = listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    renewFirestoreListener();
    isFirstRun = false;
  }
  return userSubject.asObservable();
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
    userSubject.next(null);
  } else {
    unsubscribe = createCurrentUserListener(userSubject, uid);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  userSubject.next(null);
  renewListenerTimeout = setTimeout(() => {
    renewListenerTimeout = null;
    renewFirestoreListener();
  }, LISTENER_ERROR_TIMEOUT);
}

function createCurrentUserListener(
  subject: BehaviorSubject<User | null>,
  uid: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.users, uid),
    (userSnap) => {
      const userDTO = userSnap.data();
      // If the user document does not exist, the user will be signed out.
      if (!userDTO) {
        subject.next(null);
        signOut();
        return;
      }
      if (userDTO.isDeleted) {
        subject.next(null);
        return;
      }
      const user = mapUserDTO(userDTO);
      sortDocumentStringArrays(user);
      const openWorkspaceId = getOpenWorkspaceId();
      if (openWorkspaceId && !user.workspaceIds.includes(openWorkspaceId)) setOpenWorkspaceId(null);
      subject.next(user);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      listenerError();
    }
  );
}

export const _listenCurrentUserExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
        /**
         * Stops the firestore listener, unsubscribes RxJS subscriptions and resets all module
         * variables to their initial values.
         */
        resetModule: () => {
          if (unsubscribe) unsubscribe();
          unsubscribe = null;
          if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
          renewListenerTimeout = null;
          if (signedInUserIdChangesSubscription) signedInUserIdChangesSubscription.unsubscribe();
          signedInUserIdChangesSubscription = null;
          userSubject = new BehaviorSubject<User | null>(null);
          isFirstRun = true;
        },
      }
    : undefined;
