import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import batchDeleteDocs from "backend/utils/docUtils/batchDeleteDocs.util";
import { DAYS_TO_DELETE_DOC } from "common/constants/timeToDeleteDoc.constant";
import ApiError from "common/types/apiError.class";

/**
 * Deletes the workspace and all related documents including tasks, goals, histories, etc.
 * @throws {ApiError} When the workspace document is not found, is not placed in the recycle bin
 * or has not the deleted flag set.
 */
export default async function deleteWorkspaceAndRelatedDocuments(
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const workspace = (await collections.workspaces.doc(workspaceId).get()).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  if (!workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspaceId} is not in the recycle bin.`);
  if (!workspace.isDeleted)
    throw new ApiError(
      400,
      `The workspace with id ${workspaceId} does not have the deleted flag set.`
    );
  if (!workspace.deletionTime)
    throw new ApiError(
      500,
      `The workspace with id ${workspaceId} is marked as deleted, but does not have the deletion time.`
    );
  const deletionTime = workspace.deletionTime.toDate();
  const permanentDeletionTime = new Date(
    deletionTime.getTime() + DAYS_TO_DELETE_DOC * 24 * 60 * 60 * 1000
  );
  if (permanentDeletionTime > new Date())
    throw new ApiError(
      400,
      `The workspace with id ${workspaceId} is not marked as deleted long enough.`
    );
  const userHistoriesPromise = collections.userHistories
    .where("workspaceId", "==", workspaceId)
    .get();
  const workspaceHistoriesPromise = collections.workspaceHistories
    .where("workspaceId", "==", workspaceId)
    .get();
  await Promise.all([userHistoriesPromise, workspaceHistoriesPromise]);
  const docSnapsToDelete = [
    ...(await userHistoriesPromise).docs,
    ...(await workspaceHistoriesPromise).docs,
  ];
  const docRefsToDelete = docSnapsToDelete.map((docSnap) => docSnap.ref);
  await batchDeleteDocs(docRefsToDelete);
  const batch = adminDb.batch();
  batch.delete(collections.workspaces.doc(workspaceId));
  batch.delete(collections.workspaceSummaries.doc(workspaceId));
  await batch.commit();
}
