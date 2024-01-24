import mapUserDTO from "clientApi/utils/mappers/mapUserDTO.util";
import sortDocumentStringArrays from "clientApi/utils/other/sortDocumentStringArrays.util";
import User from "common/clientModels/user.model";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getSignedInUserId, listenSignedInUserIdChanges } from "./signedInUserId.utils";

let userSubject = new BehaviorSubject<User | null>(null);
let unsubscribe: Unsubscribe | null = null;
let isSubjectError: boolean = false;
let isMainFunctionFirstRun: boolean = true;

/**
 * Listens for the signed in user document. Sends a null if the user is not signed in.
 * If the user is signed in but the user document has the deleted flag set or cannot be found,
 * sends a document with data from the firebase account.
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
      const userDTO = userSnap.data();
      if (!userDTO || userDTO.isDeleted) {
        if (!auth.currentUser) subject.next(null);
        else
          subject.next({
            id: auth.currentUser.uid,
            email: auth.currentUser.email ? auth.currentUser.email : "",
            username: auth.currentUser.displayName ? auth.currentUser.displayName : "",
            workspaceIds: [],
            workspaceInvitationIds: [],
            linkedUserDocumentIds: [],
            isBotUserDocument: false,
            dataFromFirebaseAccount: true,
            modificationTime: new Date(),
          });
        return;
      }
      const user = mapUserDTO(userDTO);
      sortDocumentStringArrays(user);
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
          userSubject.error(new Error("Testing error."));
        },
      }
    : undefined;
