import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import { PROJECT_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import User from "common/models/user.model";
import ApiError from "common/types/apiError.class";
import batchDeleteDocs from "../batchDeleteDocs.util";

/**
 * This function deletes a workspace and all related documents from Firestore.
 * Including tasks, goals, norms, etc. This function removes workspace id from users documents.
 * @throws {string} When a workspace with the provided workspace ID is not found.
 * When the workspace has belonging or invited users and hasn't been long enough in the recycle bin.
 */
export async function deleteWorkspaceAndRelatedDocuments(
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const promises: Promise<any>[] = [];
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace)
    throw new ApiError(400, `The workspace to delete with id ${workspaceId} not found.`);

  // Check if the workspace can be deleted
  if (workspace.userIds.length > 0 || workspace.invitedUserIds.length > 0) {
    if (!workspace.isInBin)
      throw new ApiError(400, `The workspace with id ${workspaceId} is not in recycle bin.`);
    if (!workspace.placingInBinTime)
      throw new ApiError(
        400,
        `The workspace with id ${workspaceId} does not have a time set when ` +
          `it was placed in the recycle bin.`
      );
    const placingInBinTime = workspace.placingInBinTime.toDate();
    const deletionTime = new Date(
      placingInBinTime.getTime() + PROJECT_DAYS_IN_BIN + 24 * 60 * 60 * 1000
    );
    if (deletionTime > new Date())
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
        workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
      })
    );
  }
  for (const userId of workspace.userIds) {
    const userRef = collections.users.doc(userId);
    promises.push(
      userRef.update({
        workspaceIds: adminArrayRemove<User, "workspaceIds">(workspaceId),
      })
    );
  }

  // Delete workspace and all related documents
  const docsToDelete = [];
  for (const docsToDeleteRef of [
    collections.tasks.where("workspaceId", "==", workspaceId),
    collections.goals.where("workspaceId", "==", workspaceId),
    collections.norms.where("workspaceId", "==", workspaceId),
    collections.completedTaskStats.where("workspaceId", "==", workspaceId),
  ]) {
    const docsToDeleteSnap = await docsToDeleteRef.get();
    for (const docSnap of docsToDeleteSnap.docs) docsToDelete.push(docSnap.ref);
  }
  promises.push(batchDeleteDocs(docsToDelete, maxDocumentDeletesPerBatch));
  promises.push(collections.workspaceUrls.doc(workspace.url).delete());
  promises.push(collections.workspaces.doc(workspaceId).delete());
  promises.push(collections.workspaceSummaries.doc(workspaceId).delete());
  promises.push(collections.workspaceCounters.doc(workspaceId).delete());
  await Promise.all(promises);
}
