import collections from "client/db/collections.firebase";
import mapWorkspaceHistoryDTO from "client/utils/mappers/historyMappers/mapWorkspaceHistoryDTO.util";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import { doc, getDoc } from "firebase/firestore";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import _updateNewestHistoryRecords from "../_updateNewestHistoryRecords.util";
import {
  getHistoryListenerState,
  listenHistoryListenerStateChanges,
  setHistoryListenerState,
} from "../historyListenerState.utils";
import _listenNewestWorkspaceHistory from "./_listenNewestWorkspaceHistory.api";

/**
 * Sorted from newest to oldest.
 */
let loadedNewestHistories: WorkspaceHistory[] = [];
/**
 * If the sort order has changed, the history records update function should be called.
 */
let currentRecordsSorting: "newestFirst" | "oldestFirst" = "newestFirst";
/**
 * History records sorted from newest to oldest.
 */
let loadedNewestHistoryRecords: WorkspaceHistory["history"] = [];
let historyRecordsSubject = new BehaviorSubject<WorkspaceHistory["history"]>([]);
/**
 * If set to false, the history records update function will not be run. If set to true, the
 * history records update function will be called. If the history records update function is
 * currently running, it will be called again after it has finished updating history records.
 */
let isPendingHistoryRecordsUpdate = false;
/**
 * If set to true, the history records update function is currently running and will return
 * immediately if called again to avoid races.
 */
let isUpdatingHistoryRecords = false;
/**
 * The history records update function will use this document to update the history records.
 * If the newest history document has been updated while the history records update function
 * is running, it is stored here to be processed after the current updates. If set to null, the
 * history records update function will return immediately if called.
 */
let newestHistoryDocument: WorkspaceHistory | null = null;
let isFirstRun: boolean = true;
let newestHistoryDocumentSubscription: Subscription | null = null;
let historyListenerStateSubscription: Subscription | null = null;

/**
 * Listens to the workspace history records. Updates the workspace history records when the
 * workspace history listener filters changes. Sends an empty array if the workspace history
 * listener filters are set to null.
 */
export default function _listenPreprocessedWorkspaceHistoryRecords(): Observable<
  WorkspaceHistory["history"]
> {
  if (isFirstRun) {
    newestHistoryDocumentSubscription = _listenNewestWorkspaceHistory().subscribe(
      (nextNewestHistoryDoc) => {
        if (nextNewestHistoryDoc == null) return;
        newestHistoryDocument = nextNewestHistoryDoc;
        isPendingHistoryRecordsUpdate = true;
        updateHistoryRecords();
      }
    );
    historyListenerStateSubscription = listenHistoryListenerStateChanges().subscribe(
      (nextHistoryListenerFilters) => {
        const nextFilter = nextHistoryListenerFilters?.["WorkspaceHistory"];
        /**
         * If the history filters are set to null, it means that the workspace has been closed
         * and the history records should be reset to their initial state.
         */
        if (!nextFilter) {
          resetStateExceptFirstRun();
          return;
        }
        if (nextFilter.loadMoreChunks || nextFilter.sort != currentRecordsSorting) {
          currentRecordsSorting = nextFilter.sort;
          isPendingHistoryRecordsUpdate = true;
          updateHistoryRecords();
        }
      }
    );
    isFirstRun = false;
  }
  return historyRecordsSubject.asObservable();
}

async function getHistoryDocumentById(historyId: string): Promise<WorkspaceHistory> {
  const historyDTO = (await getDoc(doc(collections.workspaceHistories, historyId))).data();
  if (!historyDTO) throw new Error(`History document with id ${historyId} does not exist.`);
  return mapWorkspaceHistoryDTO(historyDTO);
}

function resetStateExceptFirstRun() {
  currentRecordsSorting = "newestFirst";
  loadedNewestHistories = [];
  loadedNewestHistoryRecords = [];
  isPendingHistoryRecordsUpdate = false;
  isUpdatingHistoryRecords = false;
  newestHistoryDocument = null;
  historyRecordsSubject.next([]);
}

async function updateHistoryRecords() {
  if (
    isPendingHistoryRecordsUpdate == false ||
    newestHistoryDocument == null ||
    isUpdatingHistoryRecords ||
    !getHistoryListenerState()?.["WorkspaceHistory"]
  )
    return;
  while (isPendingHistoryRecordsUpdate) {
    if (
      newestHistoryDocument == null ||
      isUpdatingHistoryRecords ||
      !getHistoryListenerState()?.["WorkspaceHistory"]
    )
      return;
    isPendingHistoryRecordsUpdate = false;
    const userWantedMoreChunks = getHistoryListenerState()?.["WorkspaceHistory"]?.loadMoreChunks;
    isUpdatingHistoryRecords = true;
    const allChunksLoaded = await _updateNewestHistoryRecords<"WorkspaceHistory">(
      "WorkspaceHistory",
      structuredClone(newestHistoryDocument),
      loadedNewestHistoryRecords,
      loadedNewestHistories,
      getHistoryDocumentById
    );
    isUpdatingHistoryRecords = false;
    const currentFilter = getHistoryListenerState()?.["WorkspaceHistory"];
    /**
     * If the history filters are set to null, it means that the user has signed out and the
     * history records should be reset to their initial state.
     */
    if (!currentFilter) {
      resetStateExceptFirstRun();
      return;
    }
    /**
     * Do not change the listener filters and history records subject if the user has set the filters
     * to load history records in a different order while the records update function was running, or
     * if the filters have been set to null.
     */
    if (currentFilter?.sort == "newestFirst") {
      setHistoryListenerState("WorkspaceHistory", {
        ...currentFilter,
        allChunksLoaded,
        loadMoreChunks: userWantedMoreChunks == true ? false : currentFilter.loadMoreChunks,
      });
      historyRecordsSubject.next(loadedNewestHistoryRecords);
    }
  }
}

export const _listenPreprocessedWorkspaceHistoryRecordsExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        async awaitHistoryRecordsUpdates() {
          while (isUpdatingHistoryRecords) await new Promise((f) => setTimeout(f, 100));
        },
        /**
         * Awaits history records updates to finish, unsubscribes RxJS subscriptions
         * and resets all module variables to their initial values.
         */
        async resetModule() {
          await this.awaitHistoryRecordsUpdates();
          if (newestHistoryDocumentSubscription) newestHistoryDocumentSubscription.unsubscribe();
          newestHistoryDocumentSubscription = null;
          if (historyListenerStateSubscription) historyListenerStateSubscription.unsubscribe();
          historyListenerStateSubscription = null;
          resetStateExceptFirstRun();
          historyRecordsSubject = new BehaviorSubject<WorkspaceHistory["history"]>([]);
          isFirstRun = true;
        },
        getModuleState: () => ({
          loadedNewestHistories,
          currentRecordsSorting,
          loadedNewestHistoryRecords,
          isPendingHistoryRecordsUpdate,
          isUpdatingHistoryRecords,
          newestHistoryDocument,
        }),
        /**
         * Sets module variables to the provided values. If the variable is not defined it will not
         * be modified.
         */
        setModuleState(newModuleState: {
          loadedNewestHistories?: WorkspaceHistory[];
          currentRecordsSorting?: "newestFirst" | "oldestFirst";
          loadedNewestHistoryRecords?: WorkspaceHistory["history"];
          isPendingHistoryRecordsUpdate?: boolean;
          isUpdatingHistoryRecords?: boolean;
          newestHistoryDocument?: WorkspaceHistory | null;
        }) {
          loadedNewestHistories =
            newModuleState.loadedNewestHistories !== undefined
              ? newModuleState.loadedNewestHistories
              : loadedNewestHistories;
          currentRecordsSorting =
            newModuleState.currentRecordsSorting !== undefined
              ? newModuleState.currentRecordsSorting
              : currentRecordsSorting;
          loadedNewestHistoryRecords =
            newModuleState.loadedNewestHistoryRecords !== undefined
              ? newModuleState.loadedNewestHistoryRecords
              : loadedNewestHistoryRecords;
          isPendingHistoryRecordsUpdate =
            newModuleState.isPendingHistoryRecordsUpdate !== undefined
              ? newModuleState.isPendingHistoryRecordsUpdate
              : isPendingHistoryRecordsUpdate;
          isUpdatingHistoryRecords =
            newModuleState.isUpdatingHistoryRecords !== undefined
              ? newModuleState.isUpdatingHistoryRecords
              : isUpdatingHistoryRecords;
          newestHistoryDocument =
            newModuleState.newestHistoryDocument !== undefined
              ? newModuleState.newestHistoryDocument
              : newestHistoryDocument;
        },
      }
    : undefined;
