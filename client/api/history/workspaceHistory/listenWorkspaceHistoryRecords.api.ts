import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import User from "common/clientModels/user.model";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import _listenPreprocessedWorkspaceHistoryRecords from "./_listenPreprocessedWorkspaceHistoryRecords.api";

/**
 * history records sorted from newest to oldest.
 */
let historyRecordsSubject = new BehaviorSubject<WorkspaceHistory["history"]>([]);
let workspaceUsers: User[] = [];
let isFirstRun: boolean = true;
let processedHistoryRecordsSubscription: Subscription | null = null;
let workspaceUsersSubscription: Subscription | null = null;

export default function listenWorkspaceHistoryRecords(): Observable<WorkspaceHistory["history"]> {
  if (isFirstRun) {
    workspaceUsersSubscription = listenWorkspaceUsers().subscribe((nextWorkspaceUsers) => {
      workspaceUsers = nextWorkspaceUsers.docs;
      updateUserDocsInsideHistoryRecords();
    });
    processedHistoryRecordsSubscription = _listenPreprocessedWorkspaceHistoryRecords().subscribe(
      (nextPreprocessedHistoryRecords) => {
        updateUserDocsInsideHistoryRecords(nextPreprocessedHistoryRecords);
      }
    );
    isFirstRun = false;
  }
  return historyRecordsSubject.asObservable();
}

function updateUserDocsInsideHistoryRecords(
  nextPreprocessedHistoryRecords?: WorkspaceHistory["history"]
) {
  let historyRecordsToProcess: WorkspaceHistory["history"];
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

export const _listenWorkspaceHistoryRecordsExportedForTesting =
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
          historyRecordsSubject = new BehaviorSubject<WorkspaceHistory["history"]>([]);
          workspaceUsers = [];
          isFirstRun = true;
        },
      }
    : undefined;
