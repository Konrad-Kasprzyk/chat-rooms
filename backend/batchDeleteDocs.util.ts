import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";

/**
 * Takes an array of document references and deletes them in batches
 * with a specified maximum number of deletes per batch. This function prevents
 * exceeding max operations per batch limit.
 * @returns Promise of all batch commits.
 */
export default function batchDeleteDocs(
  documentsToDelete: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[],
  maxDocumentDeletesPerBatch: number = 100
): Promise<any> {
  if (maxDocumentDeletesPerBatch < 1)
    throw new ApiError(
      400,
      `Minimum one delete per batch is required. Provided ${maxDocumentDeletesPerBatch} maximum deletes per batch.`
    );
  if (documentsToDelete.length === 0) return Promise.resolve();
  const promises = [];
  let batch = adminDb.batch();
  let batchDeletionsCount = 0;
  for (const docRef of documentsToDelete) {
    if (batchDeletionsCount >= maxDocumentDeletesPerBatch) {
      promises.push(batch.commit());
      batch = adminDb.batch();
      batchDeletionsCount = 0;
    }
    batch.delete(docRef);
    batchDeletionsCount++;
  }
  if (batchDeletionsCount > 0) promises.push(batch.commit());
  return Promise.all(promises);
}
