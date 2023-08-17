import ApiError from "common/types/apiError.class";
import adminDb from "db/admin/adminDb.firebase";

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
  promises.push(batch.commit());
  return Promise.all(promises);
}