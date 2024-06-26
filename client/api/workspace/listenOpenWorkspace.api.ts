import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import LISTENER_ERROR_TIMEOUT from "client/constants/listenerErrorTimeout.constant";
import collections from "client/db/collections.firebase";
import mapWorkspaceDTO from "client/utils/mappers/mapWorkspaceDTO.util";
import sortDocumentStringArrays from "client/utils/other/sortDocumentStringArrays.util";
import Workspace from "common/clientModels/workspace.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import {
  getOpenWorkspaceId,
  listenOpenWorkspaceIdChanges,
  setOpenWorkspaceId,
} from "./openWorkspaceId.utils";

let workspaceSubject = new BehaviorSubject<Workspace | null>(null);
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;

/**
 * Listens for the open workspace document. Sends a null if the user is not signed in or no
 * workspace is open. Sends a null if the workspace is in the recycle bin or has the deleted flag
 * set. Updates the listener when the signed in user id or the open workspace id changes.
 */
export default function listenOpenWorkspace(): Observable<Workspace | null> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        workspaceSubject.complete();
      });
    }
    listenOpenWorkspaceIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    renewFirestoreListener();
    isFirstRun = false;
  }
  return workspaceSubject.asObservable();
}

export function setNextOpenWorkspace(nextOpenWorkspace: Workspace | null) {
  workspaceSubject.next(nextOpenWorkspace);
}

/**
 * Unsubscribes active listener. Creates the new listener if the ids of a signed in user
 * and an open workspace are found and links created listener with subject. Otherwise sends
 * null as the new subject value. If the timeout to renew the firestore listener is active,
 * it will be cancelled.
 */
function renewFirestoreListener() {
  if (renewListenerTimeout) {
    clearTimeout(renewListenerTimeout);
    renewListenerTimeout = null;
  }
  if (unsubscribe) unsubscribe();
  const uid = getSignedInUserId();
  const openWorkspaceId = getOpenWorkspaceId();
  if (!uid || !openWorkspaceId) {
    workspaceSubject.next(null);
  } else {
    unsubscribe = createOpenWorkspaceListener(workspaceSubject, openWorkspaceId);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  workspaceSubject.next(null);
  renewListenerTimeout = setTimeout(() => {
    renewListenerTimeout = null;
    renewFirestoreListener();
  }, LISTENER_ERROR_TIMEOUT);
}

function createOpenWorkspaceListener(
  subject: BehaviorSubject<Workspace | null>,
  workspaceId: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.workspaces, workspaceId),
    (workspaceSnap) => {
      const workspaceDTO = workspaceSnap.data();
      if (!workspaceDTO || workspaceDTO.isInBin || workspaceDTO.isDeleted) {
        setOpenWorkspaceId(null);
        subject.next(null);
        return;
      }
      const workspace = mapWorkspaceDTO(workspaceDTO);
      sortDocumentStringArrays(workspace);
      subject.next(workspace);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      listenerError();
    }
  );
}

export const _listenOpenWorkspaceExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
      }
    : undefined;
