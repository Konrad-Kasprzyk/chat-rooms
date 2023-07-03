import COLLECTIONS from "common/constants/collections";
import { PROJECT_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin";
import Workspace from "common/models/workspace.model";
import ApiError from "common/types/apiError";
import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import batchDeleteItems from "../batchDeleteItems";

/**
 * This function deletes a workspace and all related documents from Firestore.
 * Including tasks, goals, norms, etc. This function removes workspace id from user models.
 * @param {string} workspaceId - The ID of the workspace to be deleted.
 * @param {number} [maxDocumentDeletesPerBatch=100] - The maximum number of documents to delete per
 * batch. This is used to limit the number of documents deleted in a single batch operation to avoid
 * exceeding Firestore's limits.
 * @throws {string} When a workspace with the provided workspace ID is not found.
 * When the workspace has belonging users or invited users and hasn't been long enough in recycle bin.
 */
export async function deleteWorkspaceAndRelatedDocuments(
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100,
  collections: typeof COLLECTIONS = COLLECTIONS
): Promise<any[]> {
  const promises: Promise<any>[] = [];
  const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists)
    throw new ApiError(400, `Workspace to delete with id ${workspaceId} not found.`);
  const workspace = workspaceSnap.data() as Workspace;

  // Check if workspace can be deleted
  if (workspace.userIds.length > 0 || workspace.invitedUserIds.length > 0) {
    if (!workspace.inRecycleBin)
      throw new ApiError(400, `Workspace with id ${workspaceId} is not in recycle bin.`);
    if (!workspace.placingInBinTime)
      throw new ApiError(
        400,
        `Workspace with id ${workspaceId} is in recycle bin, but does not have placing in bin time.`
      );
    const placingInBinTime = workspace.placingInBinTime.toDate();
    const deletionTime = new Date();
    deletionTime.setDate(placingInBinTime.getDate() + PROJECT_DAYS_IN_BIN);
    if (new Date() < deletionTime)
      throw new ApiError(
        400,
        `Workspace with id ${workspaceId} is not long enough in recycle bin.`
      );
  }

  // Delete workspace from user models
  for (const userId of workspace.invitedUserIds) {
    const userRef = adminDb.collection(COLLECTIONS.users).doc(userId);
    promises.push(
      userRef.update({
        workspaceInvitations: FieldValue.arrayRemove({
          id: workspace.id,
          title: workspace.title,
          description: workspace.description,
        }),
        workspaceInvitationIds: FieldValue.arrayRemove(workspace.id),
      })
    );
  }
  for (const userId of workspace.userIds) {
    const userRef = adminDb.collection(COLLECTIONS.users).doc(userId);
    promises.push(
      userRef.update({
        workspaces: FieldValue.arrayRemove({
          id: workspace.id,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        }),
        workspaceIds: FieldValue.arrayRemove(workspace.id),
      })
    );
  }

  // Delete workspace and all related documents
  const docsToDelete = [];
  for (const collection of [
    collections.tasks,
    collections.goals,
    collections.norms,
    collections.completedTaskStats,
  ]) {
    const docsToDeleteRef = adminDb.collection(collection).where("workspaceId", "==", workspace.id);
    const docsToDeleteSnap = await docsToDeleteRef.get();
    for (const docSnap of docsToDeleteSnap.docs) docsToDelete.push(docSnap.ref);
  }
  promises.push(batchDeleteItems(docsToDelete, maxDocumentDeletesPerBatch));
  promises.push(adminDb.collection(collections.counters).doc(workspace.counterId).delete());
  promises.push(adminDb.collection(collections.workspaceUrls).doc(workspace.url).delete());
  promises.push(adminDb.collection(collections.workspaces).doc(workspace.id).delete());
  return Promise.all(promises);
}
