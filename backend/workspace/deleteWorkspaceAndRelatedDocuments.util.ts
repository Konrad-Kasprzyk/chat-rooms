import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import { PROJECT_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import User from "common/models/user.model";
import ApiError from "common/types/apiError.class";
import batchDeleteDocs from "../batchDeleteDocs.util";

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
  collections: typeof adminCollections = adminCollections
): Promise<any[]> {
  const promises: Promise<any>[] = [];
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Workspace to delete with id ${workspaceId} not found.`);

  // Check if workspace can be deleted
  if (workspace.userIds.length > 0 || workspace.invitedUserIds.length > 0) {
    if (!workspace.inRecycleBin)
      throw new ApiError(400, `Workspace with id ${workspaceId} is not in recycle bin.`);
    if (!workspace.placingInBinTime)
      throw new ApiError(
        500,
        `Workspace with id ${workspaceId} is in the recycle bin, but does not have the time of placing in the bin.`
      );
    const placingInBinTime = workspace.placingInBinTime.toDate();
    const deletionTime = new Date();
    deletionTime.setDate(placingInBinTime.getDate() + PROJECT_DAYS_IN_BIN);
    if (new Date() < deletionTime)
      throw new ApiError(
        400,
        `Workspace with id ${workspaceId} is not long enough in the recycle bin.`
      );
  }

  // Delete workspace from user models
  for (const userId of workspace.invitedUserIds) {
    const userRef = collections.users.doc(userId);
    promises.push(
      userRef.update({
        workspaceInvitations: adminArrayRemove<User, "workspaceInvitations">({
          id: workspace.id,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        }),
        workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspace.id),
      })
    );
  }
  for (const userId of workspace.userIds) {
    const userRef = collections.users.doc(userId);
    promises.push(
      userRef.update({
        workspaces: adminArrayRemove<User, "workspaces">({
          id: workspace.id,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        }),
        workspaceIds: adminArrayRemove<User, "workspaceIds">(workspace.id),
      })
    );
  }

  // Delete workspace and all related documents
  const docsToDelete = [];
  for (const docsToDeleteRef of [
    collections.tasks.where("workspaceId", "==", workspace.id),
    collections.goals.where("workspaceId", "==", workspace.id),
    collections.norms.where("workspaceId", "==", workspace.id),
    collections.completedTaskStats.where("workspaceId", "==", workspace.id),
  ]) {
    const docsToDeleteSnap = await docsToDeleteRef.get();
    for (const docSnap of docsToDeleteSnap.docs) docsToDelete.push(docSnap.ref);
  }
  promises.push(batchDeleteDocs(docsToDelete, maxDocumentDeletesPerBatch));
  promises.push(collections.workspaceCounters.doc(workspace.counterId).delete());
  promises.push(collections.workspaceUrls.doc(workspace.url).delete());
  promises.push(collections.workspaces.doc(workspace.id).delete());
  return Promise.all(promises);
}
