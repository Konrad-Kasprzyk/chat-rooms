import collections from "client/db/collections.firebase";
import mapChatHistoryDTO from "client/utils/mappers/historyMappers/mapChatHistoryDTO.util";
import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import { doc, getDoc } from "firebase/firestore";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import _updateNewestHistoryRecords from "../_updateNewestHistoryRecords.util";
import {
  getHistoryListenerState,
  listenHistoryListenerStateChanges,
  setHistoryListenerState,
} from "../historyListenerState.utils";
import _listenNewestChatHistory from "./_listenNewestChatHistory.api";

/**
 * Sorted from newest to oldest.
 */
let loadedNewestHistories: ChatHistory[] = [];
/**
 * If the sort order has changed, the history records update function should be called.
 */
let currentRecordsSorting: "newestFirst" | "oldestFirst" = "newestFirst";
/**
 * History records sorted from newest to oldest.
 */
let loadedNewestHistoryRecords: ChatHistory["history"] = [];
let historyRecordsSubject = new BehaviorSubject<ChatHistory["history"]>([]);
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
let newestHistoryDocument: ChatHistory | null = null;
let isFirstRun: boolean = true;
let newestHistoryDocumentSubscription: Subscription | null = null;
let historyListenerStateSubscription: Subscription | null = null;

/**
 * Listens to the chat history records. Updates the chat history records when the chat history
 * listener filters changes. Sends an empty array if the chat history listener filters are set to null.
 */
export default function _listenPreprocessedChatHistoryRecords(): Observable<
  ChatHistory["history"]
> {
  if (isFirstRun) {
    newestHistoryDocumentSubscription = _listenNewestChatHistory().subscribe(
      (nextNewestHistoryDoc) => {
        if (nextNewestHistoryDoc == null) return;
        newestHistoryDocument = nextNewestHistoryDoc;
        isPendingHistoryRecordsUpdate = true;
        updateHistoryRecords();
      }
    );
    historyListenerStateSubscription = listenHistoryListenerStateChanges().subscribe(
      (nextHistoryListenerFilters) => {
        const nextFilter = nextHistoryListenerFilters?.["ChatHistory"];
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

async function getHistoryDocumentById(historyId: string): Promise<ChatHistory> {
  const historyDTO = (await getDoc(doc(collections.chatHistories, historyId))).data();
  if (!historyDTO) throw new Error(`History document with id ${historyId} does not exist.`);
  return mapChatHistoryDTO(historyDTO);
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
    !getHistoryListenerState()?.["ChatHistory"]
  )
    return;
  while (isPendingHistoryRecordsUpdate) {
    if (
      newestHistoryDocument == null ||
      isUpdatingHistoryRecords ||
      !getHistoryListenerState()?.["ChatHistory"]
    )
      return;
    isPendingHistoryRecordsUpdate = false;
    const userWantedMoreChunks = getHistoryListenerState()?.["ChatHistory"]?.loadMoreChunks;
    isUpdatingHistoryRecords = true;
    const allChunksLoaded = await _updateNewestHistoryRecords<"ChatHistory">(
      "ChatHistory",
      structuredClone(newestHistoryDocument),
      loadedNewestHistoryRecords,
      loadedNewestHistories,
      getHistoryDocumentById
    );
    isUpdatingHistoryRecords = false;
    const currentFilter = getHistoryListenerState()?.["ChatHistory"];
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
      setHistoryListenerState("ChatHistory", {
        ...currentFilter,
        allChunksLoaded,
        loadMoreChunks: userWantedMoreChunks == true ? false : currentFilter.loadMoreChunks,
      });
      historyRecordsSubject.next(loadedNewestHistoryRecords);
    }
  }
}

export const _listenPreprocessedChatHistoryRecordsExportedForTesting =
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
          historyRecordsSubject = new BehaviorSubject<ChatHistory["history"]>([]);
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
          loadedNewestHistories?: ChatHistory[];
          currentRecordsSorting?: "newestFirst" | "oldestFirst";
          loadedNewestHistoryRecords?: ChatHistory["history"];
          isPendingHistoryRecordsUpdate?: boolean;
          isUpdatingHistoryRecords?: boolean;
          newestHistoryDocument?: ChatHistory | null;
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
