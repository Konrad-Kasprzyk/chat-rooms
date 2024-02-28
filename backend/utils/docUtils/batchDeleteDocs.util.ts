import adminDb from "backend/db/adminDb.firebase";
import OPTIMAL_MAX_OPERATIONS_PER_COMMIT from "../../constants/optimalMaxOperationsPerCommit.constant";

/**
 * Takes an array of document references and deletes them in batches.
 * This function prevents exceeding batch limits.
 * @returns Promise of all batch commits.
 */
export default function batchDeleteDocs(
  documentsToDelete: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[]
): Promise<any> {
  if (documentsToDelete.length === 0) return Promise.resolve();
  const promises = [];
  let batch = adminDb.batch();
  let batchDeletionsCount = 0;
  for (const docRef of documentsToDelete) {
    if (batchDeletionsCount >= OPTIMAL_MAX_OPERATIONS_PER_COMMIT) {
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
