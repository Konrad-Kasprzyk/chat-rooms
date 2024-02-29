import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import User from "common/clientModels/user.model";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import _listenPreprocessedUsersHistoryRecords from "./_listenPreprocessedUsersHistoryRecords.api";

/**
 * history records sorted from newest to oldest.
 */
let historyRecordsSubject = new BehaviorSubject<UsersHistory["history"]>([]);
let workspaceUsers: User[] = [];
let isFirstRun: boolean = true;
let processedHistoryRecordsSubscription: Subscription | null = null;
let workspaceUsersSubscription: Subscription | null = null;

export default function listenUsersHistoryRecords(): Observable<UsersHistory["history"]> {
  if (isFirstRun) {
    workspaceUsersSubscription = listenWorkspaceUsers().subscribe((nextWorkspaceUsers) => {
      workspaceUsers = nextWorkspaceUsers.docs;
      updateUserDocsInsideHistoryRecords();
    });
    processedHistoryRecordsSubscription = _listenPreprocessedUsersHistoryRecords().subscribe(
      (nextPreprocessedHistoryRecords) => {
        updateUserDocsInsideHistoryRecords(nextPreprocessedHistoryRecords);
      }
    );
    isFirstRun = false;
  }
  return historyRecordsSubject.asObservable();
}

function updateUserDocsInsideHistoryRecords(
  nextPreprocessedHistoryRecords?: UsersHistory["history"]
) {
  let historyRecordsToProcess: UsersHistory["history"];
  if (!nextPreprocessedHistoryRecords) {
    historyRecordsToProcess = historyRecordsSubject.value;
  } else {
    historyRecordsToProcess = nextPreprocessedHistoryRecords;
  }
  for (const historyRecord of historyRecordsToProcess) {
    const userWhoPerformedAction = workspaceUsers.find((user) => user.id === historyRecord.userId);
    if (userWhoPerformedAction) historyRecord.user = userWhoPerformedAction;
    else historyRecord.user = null;
    if (historyRecord.action == "users") {
      const addedUser = workspaceUsers.find((user) => user.id === historyRecord.value);
      if (addedUser) historyRecord.value = addedUser;
    }
  }
  historyRecordsSubject.next(historyRecordsToProcess);
}

export const _listenUsersHistoryRecordsExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        /**
         * Unsubscribes RxJS subscriptions and resets all module variables to their initial values.
         */
        async resetModule() {
          if (processedHistoryRecordsSubscription)
            processedHistoryRecordsSubscription.unsubscribe();
          processedHistoryRecordsSubscription = null;
          if (workspaceUsersSubscription) workspaceUsersSubscription.unsubscribe();
          workspaceUsersSubscription = null;
          historyRecordsSubject = new BehaviorSubject<UsersHistory["history"]>([]);
          workspaceUsers = [];
          isFirstRun = true;
        },
      }
    : undefined;
