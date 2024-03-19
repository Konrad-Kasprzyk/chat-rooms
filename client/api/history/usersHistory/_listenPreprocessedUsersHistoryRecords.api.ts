import collections from "client/db/collections.firebase";
import mapUsersHistoryDTO from "client/utils/mappers/historyMappers/mapUsersHistoryDTO.util";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import { doc, getDoc } from "firebase/firestore";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import _updateNewestHistoryRecords from "../_updateNewestHistoryRecords.util";
import {
  getHistoryListenerState,
  listenHistoryListenerStateChanges,
  setHistoryListenerState,
} from "../historyListenerState.utils";
import _listenNewestUsersHistory from "./_listenNewestUsersHistory.api";

/**
 * Sorted from newest to oldest.
 */
let loadedNewestHistories: UsersHistory[] = [];
/**
 * If the sort order has changed, the history records update function should be called.
 */
let currentRecordsSorting: "newestFirst" | "oldestFirst" = "newestFirst";
/**
 * History records sorted from newest to oldest.
 */
let loadedNewestHistoryRecords: UsersHistory["history"] = [];
let historyRecordsSubject = new BehaviorSubject<UsersHistory["history"]>([]);
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
let newestHistoryDocument: UsersHistory | null = null;
let isFirstRun: boolean = true;
let newestHistoryDocumentSubscription: Subscription | null = null;
let historyListenerStateSubscription: Subscription | null = null;

/**
 * Listens to the users history records. Updates the users history records when the users history
 * listener filters changes. Sends an empty array if the users history listener filters are set to null.
 */
export default function _listenPreprocessedUsersHistoryRecords(): Observable<
  UsersHistory["history"]
> {
  if (isFirstRun) {
    newestHistoryDocumentSubscription = _listenNewestUsersHistory().subscribe(
      (nextNewestHistoryDoc) => {
        if (nextNewestHistoryDoc == null) return;
        newestHistoryDocument = nextNewestHistoryDoc;
        isPendingHistoryRecordsUpdate = true;
        updateHistoryRecords();
      }
    );
    historyListenerStateSubscription = listenHistoryListenerStateChanges().subscribe(
      (nextHistoryListenerFilters) => {
        const nextFilter = nextHistoryListenerFilters?.["UsersHistory"];
        /**
         * If the history filters are set to null, it means that the user has signed out and the
         * history records should be reset to their initial state.
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

async function getHistoryDocumentById(historyId: string): Promise<UsersHistory> {
  const historyDTO = (await getDoc(doc(collections.userHistories, historyId))).data();
  if (!historyDTO) throw new Error(`History document with id ${historyId} does not exist.`);
  return mapUsersHistoryDTO(historyDTO);
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
    !getHistoryListenerState()?.["UsersHistory"]
  )
    return;
  while (isPendingHistoryRecordsUpdate) {
    if (
      newestHistoryDocument == null ||
      isUpdatingHistoryRecords ||
      !getHistoryListenerState()?.["UsersHistory"]
    )
      return;
    isPendingHistoryRecordsUpdate = false;
    const userWantedMoreChunks = getHistoryListenerState()?.["UsersHistory"]?.loadMoreChunks;
    isUpdatingHistoryRecords = true;
    const allChunksLoaded = await _updateNewestHistoryRecords<"UsersHistory">(
      "UsersHistory",
      structuredClone(newestHistoryDocument),
      loadedNewestHistoryRecords,
      loadedNewestHistories,
      getHistoryDocumentById
    );
    isUpdatingHistoryRecords = false;
    const currentFilter = getHistoryListenerState()?.["UsersHistory"];
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
      setHistoryListenerState("UsersHistory", {
        ...currentFilter,
        allChunksLoaded,
        loadMoreChunks: userWantedMoreChunks == true ? false : currentFilter.loadMoreChunks,
      });
      historyRecordsSubject.next(loadedNewestHistoryRecords);
    }
  }
}

export const _listenPreprocessedUsersHistoryRecordsExportedForTesting =
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
          historyRecordsSubject = new BehaviorSubject<UsersHistory["history"]>([]);
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
          loadedNewestHistories?: UsersHistory[];
          currentRecordsSorting?: "newestFirst" | "oldestFirst";
          loadedNewestHistoryRecords?: UsersHistory["history"];
          isPendingHistoryRecordsUpdate?: boolean;
          isUpdatingHistoryRecords?: boolean;
          newestHistoryDocument?: UsersHistory | null;
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
