import HistoryModels from "common/types/history/historyModels.type";
import { getHistoryListenerState } from "./historyListenerState.utils";

/**
 * If the history listener state is set to load more chunks, it will load the next history document
 * (if next history document is not the provided newestHistory document) and update the provided
 * history documents and history records.
 * @param newestHistory History document to get the most recent history records from. If all the
 * older history documents have not been loaded, this document will not be used to update the
 * history records.
 * @param historyRecords History records to update, sorted from the oldest to the newest.
 * @param histories History documents to update, sorted from the oldest to the newest.
 * @param getHistoryDocumentByOlderDocumentId Function to obtain a history document by its older
 * document id field.
 * @returns True if all history chunks/documents have been loaded and there are no more history
 * records to load in the future, false otherwise.
 */
export default async function _updateOldestHistoryRecords<HistoryKey extends keyof HistoryModels>(
  historyKey: HistoryKey,
  newestHistory: HistoryModels[HistoryKey],
  historyRecords: HistoryModels[HistoryKey]["history"],
  histories: HistoryModels[HistoryKey][],
  getHistoryDocumentByOlderDocumentId: (
    olderHistoryId: string | null
  ) => Promise<HistoryModels[HistoryKey]>
): Promise<boolean> {
  if (histories.length == 0 || historyRecords.length == 0) {
    histories.splice(0, histories.length);
    historyRecords.splice(0, historyRecords.length);
    /**
     * The newest history document is the only history document. There are no other histories to load.
     */
    if (newestHistory.olderHistoryId == null) {
      histories.push(newestHistory);
      historyRecords.push(...(newestHistory.history as any));
      return true;
    }
    const oldestHistory = await getHistoryDocumentByOlderDocumentId(null);
    histories.push(oldestHistory);
    historyRecords.push(...(oldestHistory.history as any));
    return false;
  }
  /**
   * Newest history document is the only loaded history document.
   */
  if (histories.length == 1 && histories[0].id == newestHistory.id) {
    /**
     * Newest history document has split half of its history records into a separate history document.
     */
    if (histories[0].olderHistoryId == null && newestHistory.olderHistoryId != null) {
      const oldestHistory = await getHistoryDocumentByOlderDocumentId(null);
      histories[0] = oldestHistory;
      /**
       * There are only two history documents, the oldest and the newest. As we have both, load them.
       */
      if (newestHistory.olderHistoryId == oldestHistory.id) {
        histories.push(newestHistory);
      }
    } else {
      histories[0] = newestHistory;
    }
    const currentFilters = getHistoryListenerState();
    if (
      // check if there are more history documents to load
      histories[histories.length - 1].id != newestHistory.id &&
      currentFilters?.[historyKey]?.loadMoreChunks
    ) {
      const newHistory = await getHistoryDocumentByOlderDocumentId(
        histories[histories.length - 1].olderHistoryId
      );
      histories.push(newHistory);
    }
    /**
     * Not all history documents have been loaded yet.
     */
  } else if (histories[histories.length - 1].id != newestHistory.id) {
    const currentFilters = getHistoryListenerState();
    if (currentFilters?.[historyKey]?.loadMoreChunks) {
      const newHistory = await getHistoryDocumentByOlderDocumentId(
        histories[histories.length - 1].olderHistoryId
      );
      histories.push(newHistory);
    } else {
      return false;
    }
    /**
     * All history documents have been loaded, but there is possibly a missing history document
     * in the chain of history documents. It is possible that the history document with the most
     * recent history records had split half of its history records into a separate history document.
     */
  } else {
    /**
     * Save the updated newest history document.
     */
    histories[histories.length - 1] = newestHistory;
    /**
     * Check if there are no holes in the history documents chain.
     */
    let isPossibleMissingHistory = true;
    while (isPossibleMissingHistory) {
      isPossibleMissingHistory = false;
      for (let i = 1; i < histories.length; i++) {
        if (histories[i].olderHistoryId === null)
          throw new Error(
            `The history document with id ${histories[i].id} does not have an older history id.`
          );
        if (histories[i].olderHistoryId != histories[i - 1].id) {
          const missingHistory = await getHistoryDocumentByOlderDocumentId(
            histories[i].olderHistoryId
          );
          histories.splice(i, 0, missingHistory);
          isPossibleMissingHistory = true;
          break;
        }
      }
    }
  }
  /**
   * Update the history records.
   */
  historyRecords.splice(0, historyRecords.length);
  for (const historyDoc of histories) historyRecords.push(...(historyDoc.history as any));
  /**
   * Check if all history chunks/documents have been loaded and there are no more history records
   * to load in the future.
   */
  if (histories[histories.length - 1].id == newestHistory.id) return true;
  return false;
}
