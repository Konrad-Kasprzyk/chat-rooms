import MAX_HISTORY_RECORDS from "backend/constants/maxHistoryRecords.constant";
import HistoryModelDTOSchema from "common/DTOModels/historyModels/historyModelDTOSchema.interface";
import HistoryModelsDTO from "common/types/history/historyModelsDTO.type";
import {
  CollectionReference,
  FieldValue,
  Timestamp,
  Transaction,
  UpdateData,
} from "firebase-admin/firestore";
import splitHistory from "./splitHistory.util";

/**
 * Adds a history record to the history document. Splits records into a new history document if it
 * has exceeded the maximum number of history records.
 * @param transaction Firestore transaction after all read operations.
 * @param historyDoc History document to add the history record to.
 * @param historyRecord History record to add to the history document.
 * @param historyCollection Collection reference to the history collection of the history document.
 * @returns True if the provided history document has split half of its history records into a
 * new history document, false otherwise.
 */
export default function addHistoryRecord<HistoryModelDTO extends HistoryModelsDTO>(
  transaction: Transaction,
  historyDoc: HistoryModelDTO,
  historyRecord: {
    action: HistoryModelDTO["history"][string]["action"];
    userId: HistoryModelDTO["history"][string]["userId"];
    oldValue: HistoryModelDTO["history"][string]["oldValue"];
    value: HistoryModelDTO["history"][string]["value"];
  },
  historyCollection: CollectionReference<HistoryModelDTO, HistoryModelDTO>
): boolean {
  const newRecord: HistoryModelDTOSchema["history"][string] = {
    ...historyRecord,
    id:
      historyDoc.historyRecordsCount == 0
        ? 0
        : historyDoc.history[(historyDoc.historyRecordsCount - 1).toString()].id + 1,
    date: FieldValue.serverTimestamp() as Timestamp,
  };
  historyDoc.history[historyDoc.historyRecordsCount.toString()] =
    newRecord as HistoryModelDTO["history"][string];
  historyDoc.historyRecordsCount++;
  if (historyDoc.historyRecordsCount > MAX_HISTORY_RECORDS) {
    splitHistory(transaction, historyDoc, historyCollection);
    return true;
  }
  const historyUpdates: Partial<HistoryModelDTOSchema> = {
    history: historyDoc.history,
    historyRecordsCount: historyDoc.historyRecordsCount,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  };
  transaction.update(
    historyCollection.doc(historyDoc.id),
    historyUpdates as UpdateData<HistoryModelDTO>
  );
  return false;
}
