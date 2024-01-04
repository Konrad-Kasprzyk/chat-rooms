import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";
import MAX_OPERATIONS_PER_BATCH from "./constants/maxOperationsPerBatch.constant";

/**
 * Takes an array of document references and updates them in batches
 * with a specified maximum number of updates per batch. This function prevents
 * exceeding max operations per batch limit.
 * @returns Promise of all batch commits.
 */
export default function batchUpdateDocs<T extends object>(
  documentsToUpdate: FirebaseFirestore.DocumentReference<T>[],
  updates: FirebaseFirestore.UpdateData<T>,
  maxDocumentUpdatesPerBatch: number = MAX_OPERATIONS_PER_BATCH
): Promise<any> {
  if (maxDocumentUpdatesPerBatch < 1)
    throw new ApiError(
      400,
      `Minimum one update per batch is required. Provided ${maxDocumentUpdatesPerBatch} maximum updates per batch.`
    );
  if (documentsToUpdate.length === 0) return Promise.resolve();
  const promises = [];
  let batch = adminDb.batch();
  let batchUpdatesCount = 0;
  for (const docRef of documentsToUpdate) {
    if (batchUpdatesCount >= maxDocumentUpdatesPerBatch) {
      promises.push(batch.commit());
      batch = adminDb.batch();
      batchUpdatesCount = 0;
    }
    batch.update(docRef, updates);
    batchUpdatesCount++;
  }
  if (batchUpdatesCount > 0) promises.push(batch.commit());
  return Promise.all(promises);
}
