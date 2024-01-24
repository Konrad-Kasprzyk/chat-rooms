import collections from "clientApi/db/collections.firebase";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "clientApi/user/signedInUserId.utils";
import mapWorkspaceDTO from "clientApi/utils/mappers/mapWorkspaceDTO.util";
import sortDocumentStringArrays from "clientApi/utils/other/sortDocumentStringArrays.util";
import Workspace from "common/clientModels/workspace.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getOpenWorkspaceId, listenOpenWorkspaceIdChanges } from "./openWorkspaceId.utils";

let workspaceSubject = new BehaviorSubject<Workspace | null>(null);
let unsubscribe: Unsubscribe | null = null;
let isSubjectError: boolean = false;
let isFirstMainFunctionRun: boolean = true;

/**
 * Listens for the open workspace document.
 * Sends a null if the user is not signed in or no workspace is open. Sends a null if the workspace
 * is in the recycle bin, has the deleted flag set or the singed in user does not belong to it.
 * Updates the listener when the signed in user id or the open workspace id changes.
 */
export default function listenOpenWorkspace(): Observable<Workspace | null> {
  if (isFirstMainFunctionRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (unsubscribe) unsubscribe();
        if (!isSubjectError) workspaceSubject.complete();
      });
    }
    listenOpenWorkspaceIdChanges().subscribe(() => {
      if (isSubjectError) return;
      renewFirestoreListener();
    });
    listenSignedInUserIdChanges().subscribe(() => {
      if (isSubjectError) return;
      renewFirestoreListener();
    });
    renewFirestoreListener();
    isFirstMainFunctionRun = false;
  }
  if (isSubjectError) {
    workspaceSubject = new BehaviorSubject<Workspace | null>(null);
    isSubjectError = false;
    renewFirestoreListener();
  }
  return workspaceSubject.asObservable();
}

/**
 * Unsubscribes active listener. Creates the new listener if the ids of a signed in user
 * and an open workspace are found and links created listener with subject. Otherwise sends
 * null as the new subject value.
 */
function renewFirestoreListener() {
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  const openWorkspaceId = getOpenWorkspaceId();
  if (!uid || !openWorkspaceId) {
    workspaceSubject.next(null);
  } else {
    unsubscribe = createOpenWorkspaceListener(workspaceSubject, openWorkspaceId);
  }
}

function createOpenWorkspaceListener(
  subject: BehaviorSubject<Workspace | null>,
  workspaceId: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.workspaces, workspaceId),
    (workspaceSnap) => {
      if (isSubjectError) return;
      const workspaceDTO = workspaceSnap.data();
      if (!workspaceDTO || workspaceDTO.isInBin || workspaceDTO.isDeleted) {
        subject.next(null);
        return;
      }
      const workspace = mapWorkspaceDTO(workspaceDTO);
      sortDocumentStringArrays(workspace);
      subject.next(workspace);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      isSubjectError = true;
      subject.error(error);
    }
  );
}

export const _listenOpenWorkspaceExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          isSubjectError = true;
          workspaceSubject.error(new Error("Testing error."));
        },
      }
    : undefined;
