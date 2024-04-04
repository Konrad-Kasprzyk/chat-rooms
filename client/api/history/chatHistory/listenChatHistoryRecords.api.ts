import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import User from "common/clientModels/user.model";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import _listenPreprocessedChatHistoryRecords from "./_listenPreprocessedChatHistoryRecords.api";

/**
 * history records sorted from newest to oldest.
 */
let historyRecordsSubject = new BehaviorSubject<ChatHistory["history"]>([]);
let workspaceUsers: User[] = [];
let isFirstRun: boolean = true;
let preprocessedHistoryRecordsSubscription: Subscription | null = null;
let workspaceUsersSubscription: Subscription | null = null;

/**
 * Chat messages are sorted from newest to oldest.
 */
export default function listenChatHistoryRecords(): Observable<ChatHistory["history"]> {
  if (isFirstRun) {
    workspaceUsersSubscription = listenWorkspaceUsers().subscribe((nextWorkspaceUsers) => {
      workspaceUsers = nextWorkspaceUsers.docs;
      updateUserDocsInsideHistoryRecords();
    });
    preprocessedHistoryRecordsSubscription = _listenPreprocessedChatHistoryRecords().subscribe(
      (nextPreprocessedHistoryRecords) => {
        updateUserDocsInsideHistoryRecords(nextPreprocessedHistoryRecords);
      }
    );
    isFirstRun = false;
  }
  return historyRecordsSubject.asObservable();
}

function updateUserDocsInsideHistoryRecords(
  nextPreprocessedHistoryRecords?: ChatHistory["history"]
) {
  let historyRecordsToProcess: ChatHistory["history"];
  if (!nextPreprocessedHistoryRecords) {
    historyRecordsToProcess = historyRecordsSubject.value;
  } else {
    historyRecordsToProcess = nextPreprocessedHistoryRecords;
  }
  for (const historyRecord of historyRecordsToProcess) {
    const userWhoPerformedAction = workspaceUsers.find((user) => user.id === historyRecord.userId);
    if (userWhoPerformedAction) historyRecord.user = userWhoPerformedAction;
    else historyRecord.user = null;
  }
  historyRecordsSubject.next([...historyRecordsToProcess]);
}

export const _listenChatHistoryRecordsExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        /**
         * Unsubscribes RxJS subscriptions and resets all module variables to their initial values.
         */
        async resetModule() {
          if (preprocessedHistoryRecordsSubscription)
            preprocessedHistoryRecordsSubscription.unsubscribe();
          preprocessedHistoryRecordsSubscription = null;
          if (workspaceUsersSubscription) workspaceUsersSubscription.unsubscribe();
          workspaceUsersSubscription = null;
          historyRecordsSubject = new BehaviorSubject<ChatHistory["history"]>([]);
          workspaceUsers = [];
          isFirstRun = true;
        },
      }
    : undefined;
