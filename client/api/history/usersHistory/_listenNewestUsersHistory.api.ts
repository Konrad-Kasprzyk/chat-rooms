import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import LISTENER_ERROR_TIMEOUT from "client/constants/listenerErrorTimeout.constant";
import collections from "client/db/collections.firebase";
import mapUsersHistoryDTO from "client/utils/mappers/historyMappers/mapUsersHistoryDTO.util";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import listenOpenWorkspace from "../../workspace/listenOpenWorkspace.api";

let usersHistorySubject = new BehaviorSubject<UsersHistory | null>(null);
let newestUsersHistoryId: string | null = null;
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;

export default function _listenNewestUsersHistory(): Observable<UsersHistory | null> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        usersHistorySubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    listenOpenWorkspace().subscribe((openWorkspace) => {
      let nextNewestUsersHistoryId: string | null =
        openWorkspace == null ? null : openWorkspace.newestUsersHistoryId;
      if (newestUsersHistoryId != nextNewestUsersHistoryId) {
        newestUsersHistoryId = nextNewestUsersHistoryId;
        renewFirestoreListener();
      }
    });
    isFirstRun = false;
  }
  return usersHistorySubject.asObservable();
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
  if (!uid || !newestUsersHistoryId) {
    usersHistorySubject.next(null);
  } else {
    unsubscribe = createUsersHistoryListener(usersHistorySubject, newestUsersHistoryId);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  usersHistorySubject.next(null);
  renewListenerTimeout = setTimeout(() => {
    renewListenerTimeout = null;
    renewFirestoreListener();
  }, LISTENER_ERROR_TIMEOUT);
}

function createUsersHistoryListener(
  subject: BehaviorSubject<UsersHistory | null>,
  historyId: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.userHistories, historyId),
    (historySnap) => {
      const historyDTO = historySnap.data();
      if (!historyDTO) {
        subject.next(null);
        return;
      }
      const history = mapUsersHistoryDTO(historyDTO);
      subject.next(history);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      listenerError();
    }
  );
}

export const _listenNewestUsersHistoryExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
      }
    : undefined;
