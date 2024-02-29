import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import LISTENER_ERROR_TIMEOUT from "client/constants/listenerErrorTimeout.constant";
import collections from "client/db/collections.firebase";
import mapWorkspaceHistoryDTO from "client/utils/mappers/historyMappers/mapWorkspaceHistoryDTO.util";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import listenOpenWorkspace from "../../workspace/listenOpenWorkspace.api";

let workspaceHistorySubject = new BehaviorSubject<WorkspaceHistory | null>(null);
let newestWorkspaceHistoryId: string | null = null;
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;

export default function _listenNewestWorkspaceHistory(): Observable<WorkspaceHistory | null> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        workspaceHistorySubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    listenOpenWorkspace().subscribe((openWorkspace) => {
      let nextNewestWorkspaceHistoryId: string | null =
        openWorkspace == null ? null : openWorkspace.newestWorkspaceHistoryId;
      if (newestWorkspaceHistoryId != nextNewestWorkspaceHistoryId) {
        newestWorkspaceHistoryId = nextNewestWorkspaceHistoryId;
        renewFirestoreListener();
      }
    });
    isFirstRun = false;
  }
  return workspaceHistorySubject.asObservable();
}

/**
 * Unsubscribes active listener. Creates the new listener if the ids of a signed in user
 * and a newest history are found and links created listener with subject. Otherwise sends
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
  if (!uid || !newestWorkspaceHistoryId) {
    workspaceHistorySubject.next(null);
  } else {
    unsubscribe = createUsersHistoryListener(workspaceHistorySubject, newestWorkspaceHistoryId);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  workspaceHistorySubject.next(null);
  renewListenerTimeout = setTimeout(() => {
    renewListenerTimeout = null;
    renewFirestoreListener();
  }, LISTENER_ERROR_TIMEOUT);
}

function createUsersHistoryListener(
  subject: BehaviorSubject<WorkspaceHistory | null>,
  historyId: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.workspaceHistories, historyId),
    (historySnap) => {
      const historyDTO = historySnap.data();
      if (!historyDTO) {
        subject.next(null);
        return;
      }
      const history = mapWorkspaceHistoryDTO(historyDTO);
      subject.next(history);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      listenerError();
    }
  );
}

export const _listenNewestWorkspaceHistoryExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
      }
    : undefined;
