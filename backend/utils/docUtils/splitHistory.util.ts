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

/**
 * Creates a new history document and moves half of the history records from the provided history
 * document to the new one. Does nothing if the history document has not exceeded the maximum number
 * of history records.
 * @param transaction Firestore transaction after all read operations.
 * @param historyDoc History document to split.
 * @param historyCollection Collection reference to the history collection of the history document.
 */
export default function splitHistory<HistoryModelDTO extends HistoryModelsDTO>(
  transaction: Transaction,
  historyDoc: HistoryModelDTO,
  historyCollection: CollectionReference<HistoryModelDTO, HistoryModelDTO>
): void {
  if (historyDoc.historyRecordsCount <= MAX_HISTORY_RECORDS) return;
  const middleIndex = Math.floor(historyDoc.historyRecordsCount / 2);
  const olderHistoriesChunk: HistoryModelDTO["history"] = {};
  const newerHistoriesChunk: HistoryModelDTO["history"] = {};
  for (let i = 0; i < middleIndex; i++)
    olderHistoriesChunk[i.toString()] = historyDoc.history[i.toString()];
  for (let i = middleIndex; i < historyDoc.historyRecordsCount; i++)
    newerHistoriesChunk[(i - middleIndex).toString()] = historyDoc.history[i.toString()];
  const olderHistoryRef = historyCollection.doc();
  const olderHistory: HistoryModelDTOSchema = {
    id: olderHistoryRef.id,
    workspaceId: historyDoc.workspaceId,
    olderHistoryId: historyDoc.olderHistoryId,
    history: olderHistoriesChunk,
    historyRecordsCount: middleIndex,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  };
  transaction.create(olderHistoryRef, olderHistory);
  const newestHistoryUpdates: Partial<HistoryModelDTOSchema> = {
    olderHistoryId: olderHistoryRef.id,
    history: newerHistoriesChunk,
    historyRecordsCount: historyDoc.historyRecordsCount - middleIndex,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  };
  transaction.update(
    historyCollection.doc(historyDoc.id),
    newestHistoryUpdates as UpdateData<HistoryModelDTO>
  );
}
