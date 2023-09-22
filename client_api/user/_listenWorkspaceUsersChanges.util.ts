import {
  getOpenWorkspaceId,
  listenOpenWorkspaceIdChanges,
} from "client_api/workspace/openWorkspaceId.utils";
import collections from "common/db/collections.firebase";
import User from "common/models/user.model";
import docsSnap from "common/types/docsSnap.type";
import { FirestoreError, Timestamp, Unsubscribe, onSnapshot } from "firebase/firestore";
import { Observable, Subject } from "rxjs";
import { getSignedInUserId, listenSignedInUserIdChanges } from "./signedInUserId.utils";

let usersSubject = new Subject<docsSnap<User>["updates"]>();
let unsubscribe: Unsubscribe | null = null;
let isSubjectError: boolean = false;
let isMainFunctionFirstRun: boolean = true;

/**
 * Listens for changes in User documents for the open workspace.
 * Saves and updates new User documents to the indexedDB.
 */
export default function _listenWorkspaceUsersChanges(): Observable<docsSnap<User>["updates"]> {
  if (isMainFunctionFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (unsubscribe) unsubscribe();
        if (!isSubjectError) usersSubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      if (isSubjectError) return;
      renewListener();
    });
    listenOpenWorkspaceIdChanges().subscribe(() => {
      if (isSubjectError) return;
      renewListener();
    });
    renewListener();
    isMainFunctionFirstRun = false;
  }
  if (isSubjectError) {
    usersSubject = new Subject<docsSnap<User>["updates"]>();
    isSubjectError = false;
    renewListener();
  }
  return usersSubject.asObservable();
}

/**
 * Unsubscribes active listener. Creates a new listener if the ids of the signed in user
 * and the open workspace are found, and links the created listener to the subject.
 * Otherwise, it sends an empty array as the new subject value.
 */
function renewListener() {
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  const openWorkspaceId = getOpenWorkspaceId();
  if (!uid || !openWorkspaceId) {
    usersSubject.next([]);
  } else {
    unsubscribe = createWorkspaceUsersListener(usersSubject, openWorkspaceId);
  }
}

function createWorkspaceUsersListener(
  subject: Subject<docsSnap<User>["updates"]>,
  openWorkspaceId: string
): Unsubscribe {
  const query = collections.users
    .where("modificationTime", ">=", Timestamp.now())
    .where("workspaceIds", "array-contains", openWorkspaceId);
  return onSnapshot(
    query,
    (docsSnap) => {
      const userUpdates: docsSnap<User>["updates"] = [];
      for (const docChange of docsSnap.docChanges()) {
        userUpdates.push({ type: docChange.type, doc: docChange.doc.data() });
      }
      // TODO save new docs into indexedDB
      subject.next(userUpdates);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      isSubjectError = true;
      subject.error(error);
    }
  );
}

export const _listenWorkspaceUsersChangesExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          isSubjectError = true;
          usersSubject.error("Testing error.");
        },
      }
    : undefined;
