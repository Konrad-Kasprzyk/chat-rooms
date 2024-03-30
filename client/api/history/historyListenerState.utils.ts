import equal from "fast-deep-equal/es6";
import { Observable, Subject } from "rxjs";
import { listenOpenWorkspaceIdChanges } from "../workspace/openWorkspaceId.utils";
import HistoryListenerFilters from "./historyListenerFilters.type";

const initialListenerState: HistoryListenerFilters = {
  ChatHistory: null,
  UsersHistory: null,
  WorkspaceHistory: null,
};
let historyListenerState: HistoryListenerFilters | null = null;
const historyListenerStateSubject = new Subject<HistoryListenerFilters | null>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    historyListenerStateSubject.complete();
  });
}

listenOpenWorkspaceIdChanges().subscribe((workspaceId) => {
  if (workspaceId == null) {
    historyListenerState = null;
    historyListenerStateSubject.next(null);
  }
});

export function listenHistoryListenerStateChanges(): Observable<HistoryListenerFilters | null> {
  return historyListenerStateSubject.asObservable();
}

export function getHistoryListenerState(): HistoryListenerFilters | null {
  return historyListenerState;
}

/**
 * Use to fetch more history records and change history records sorting.
 */
export function setHistoryListenerState(
  historyKey: keyof HistoryListenerFilters,
  newHistoryListenerFilter: HistoryListenerFilters[typeof historyKey]
): void {
  if (historyListenerState == null) {
    historyListenerState = { ...initialListenerState, [historyKey]: newHistoryListenerFilter };
    historyListenerStateSubject.next(historyListenerState);
    return;
  }
  const currentFilter = historyListenerState[historyKey];
  if (!equal(currentFilter, newHistoryListenerFilter)) {
    historyListenerState = { ...historyListenerState, [historyKey]: newHistoryListenerFilter };
    historyListenerStateSubject.next(historyListenerState);
  }
}

export function setHistoryListenerStateToNull() {
  historyListenerState = null;
  historyListenerStateSubject.next(null);
}

export const _historyListenerStateExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        initialListenerState,
      }
    : undefined;
