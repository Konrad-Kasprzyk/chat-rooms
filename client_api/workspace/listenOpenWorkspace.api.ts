import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client_api/user/signedInUserId.utils";
import collections from "common/db/collections.firebase";
import Workspace from "common/models/workspace_models/workspace.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { getOpenWorkspaceId, listenOpenWorkspaceIdChanges } from "./openWorkspaceId.utils";

let workspaceSubject = new BehaviorSubject<Workspace | null>(null);
let unsubscribe: Unsubscribe | null = null;
let isSubjectError: boolean = false;
let isFirstMainFunctionRun: boolean = true;

/**
 * Creates new subject and listener for the open workspace.
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
      renewListener();
    });
    listenSignedInUserIdChanges().subscribe(() => {
      if (isSubjectError) return;
      renewListener();
    });
    renewListener();
    isFirstMainFunctionRun = false;
  }
  if (isSubjectError) {
    workspaceSubject = new BehaviorSubject<Workspace | null>(null);
    isSubjectError = false;
    renewListener();
  }
  return workspaceSubject.asObservable();
}

/**
 * Unsubscribes active listener. Creates the new listener if the ids of a signed in user
 * and an open workspace are found and links created listener with subject. Otherwise sends
 * null as the new subject value.
 */
function renewListener() {
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
      if (!workspaceSnap.exists()) {
        subject.next(null);
        return;
      }
      const workspace = workspaceSnap.data();
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
          workspaceSubject.error("Testing error.");
        },
      }
    : undefined;
