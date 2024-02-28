import adminDb from "backend/db/adminDb.firebase";
import OPTIMAL_MAX_OPERATIONS_PER_COMMIT from "../../constants/optimalMaxOperationsPerCommit.constant";

/**
 * Takes an array of document references and updates them in batches.
 * This function prevents exceeding batch limits.
 * @returns Promise of all batch commits.
 */
export default function batchUpdateDocs<T extends object>(
  documentsToUpdate: FirebaseFirestore.DocumentReference<T>[],
  updates: FirebaseFirestore.UpdateData<T>
): Promise<any> {
  if (documentsToUpdate.length === 0) return Promise.resolve();
  const promises = [];
  let batch = adminDb.batch();
  let batchUpdatesCount = 0;
  for (const docRef of documentsToUpdate) {
    if (batchUpdatesCount >= OPTIMAL_MAX_OPERATIONS_PER_COMMIT) {
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
