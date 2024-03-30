import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import LISTENER_ERROR_TIMEOUT from "client/constants/listenerErrorTimeout.constant";
import collections from "client/db/collections.firebase";
import mapChatHistoryDTO from "client/utils/mappers/historyMappers/mapChatHistoryDTO.util";
import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import { FirestoreError, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import listenOpenWorkspace from "../../workspace/listenOpenWorkspace.api";

let chatHistorySubject = new BehaviorSubject<ChatHistory | null>(null);
let newestChatHistoryId: string | null = null;
let unsubscribe: Unsubscribe | null = null;
let renewListenerTimeout: ReturnType<typeof setTimeout> | null = null;
let isFirstRun: boolean = true;

export default function _listenNewestChatHistory(): Observable<ChatHistory | null> {
  if (isFirstRun) {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (renewListenerTimeout) clearTimeout(renewListenerTimeout);
        if (unsubscribe) unsubscribe();
        chatHistorySubject.complete();
      });
    }
    listenSignedInUserIdChanges().subscribe(() => {
      renewFirestoreListener();
    });
    listenOpenWorkspace().subscribe((openWorkspace) => {
      let nextNewestChatHistoryId: string | null =
        openWorkspace == null ? null : openWorkspace.newestChatHistoryId;
      if (newestChatHistoryId != nextNewestChatHistoryId) {
        newestChatHistoryId = nextNewestChatHistoryId;
        renewFirestoreListener();
      }
    });
    isFirstRun = false;
  }
  return chatHistorySubject.asObservable();
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
  if (!uid || !newestChatHistoryId) {
    chatHistorySubject.next(null);
  } else {
    unsubscribe = createChatHistoryListener(chatHistorySubject, newestChatHistoryId);
  }
}

function listenerError() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  chatHistorySubject.next(null);
  renewListenerTimeout = setTimeout(() => {
    renewListenerTimeout = null;
    renewFirestoreListener();
  }, LISTENER_ERROR_TIMEOUT);
}

function createChatHistoryListener(
  subject: BehaviorSubject<ChatHistory | null>,
  historyId: string
): Unsubscribe {
  return onSnapshot(
    doc(collections.chatHistories, historyId),
    (historySnap) => {
      const historyDTO = historySnap.data();
      if (!historyDTO) {
        subject.next(null);
        return;
      }
      const history = mapChatHistoryDTO(historyDTO);
      subject.next(history);
    },
    // The listener is automatically unsubscribed on error.
    (error: FirestoreError) => {
      listenerError();
    }
  );
}

export const _listenNewestChatHistoryExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        setSubjectError: () => {
          listenerError();
        },
      }
    : undefined;
