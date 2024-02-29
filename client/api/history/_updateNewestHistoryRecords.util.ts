import HistoryModels from "common/types/history/historyModels.type";
import { getHistoryListenerState } from "./historyListenerState.utils";

/**
 * Updates the provided history documents and history records with the data from the most recent
 * history document. If the history listener state is set to load more chunks, it will fetch the
 * next history document.
 * @param newestHistory History document to get the most recent history records from.
 * @param historyRecords History records to update, sorted from the newest to the oldest.
 * @param histories History documents to update, sorted from the newest to the oldest.
 * @param getHistoryDocumentById Function to obtain a history document by its id.
 * @returns True if all history chunks/documents have been loaded and there are no more history
 * records to load in the future, false otherwise.
 */
export default async function _updateNewestHistoryRecords<HistoryKey extends keyof HistoryModels>(
  historyKey: HistoryKey,
  newestHistory: HistoryModels[HistoryKey],
  historyRecords: HistoryModels[HistoryKey]["history"],
  histories: HistoryModels[HistoryKey][],
  getHistoryDocumentById: (historyId: string) => Promise<HistoryModels[HistoryKey]>
): Promise<boolean> {
  if (histories.length == 0 || historyRecords.length == 0) {
    histories.splice(0, histories.length);
    historyRecords.splice(0, historyRecords.length);
    histories.push(newestHistory);
    historyRecords.push(...([...newestHistory.history].reverse() as any));
    if (newestHistory.olderHistoryId == null) return true;
    return false;
  }
  /**
   * If there is only one history document, the while loop for checking if there are missing
   * history documents in the chain of history documents will not run.
   */
  if (
    histories.length == 1 &&
    histories[0].olderHistoryId == null &&
    newestHistory.olderHistoryId != null
  ) {
    const missingHistory = await getHistoryDocumentById(newestHistory.olderHistoryId);
    histories.push(missingHistory);
  }
  /**
   * Save the updated newest history document.
   */
  histories[0] = newestHistory;
  /**
   * Check if there are no holes in the history documents chain. It is possible that the
   * history document with the most recent history records had split half of its history
   * records into a separate history document.
   */
  let isPossibleMissingHistory = true;
  while (isPossibleMissingHistory) {
    isPossibleMissingHistory = false;
    for (let i = 0; i < histories.length - 1; i++) {
      if (histories[i].olderHistoryId === null)
        throw new Error(
          `The history document with id ${histories[i].id} does not have an older history id.`
        );
      if (histories[i].olderHistoryId != histories[i + 1].id) {
        const missingHistory = await getHistoryDocumentById(histories[i].olderHistoryId!);
        histories.splice(i + 1, 0, missingHistory);
        isPossibleMissingHistory = true;
        break;
      }
    }
  }
  /**
   * Load new history chunk/document if the listener is set to do so.
   */
  const currentFilters = getHistoryListenerState();
  if (
    currentFilters?.[historyKey]?.loadMoreChunks &&
    histories[histories.length - 1].olderHistoryId != null
  ) {
    const nextHistoryDoc = await getHistoryDocumentById(
      histories[histories.length - 1].olderHistoryId!
    );
    histories.push(nextHistoryDoc);
  }
  /**
   * Update the history records.
   */
  historyRecords.splice(0, historyRecords.length);
  for (const historyDoc of histories)
    historyRecords.push(...([...historyDoc.history].reverse() as any));
  /**
   * Check if all history chunks/documents have been loaded and there are no more history records
   * to load in the future.
   */
  if (histories[histories.length - 1].olderHistoryId == null) return true;
  return false;
}
