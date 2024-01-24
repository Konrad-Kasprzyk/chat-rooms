import batchUpdateDocs from "backend/batchUpdateDocs.util";
import MAX_OPERATIONS_PER_BATCH from "backend/constants/maxOperationsPerBatch.constant";
import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Deletes user and user details documents, removes the user from workspaces documents.
 * @throws {ApiError} When the user document is not found or does not have the deleted flag set.
 */
export default async function deleteUser(
  userId: string,
  collections: typeof adminCollections = adminCollections,
  maxOperationsPerBatch: number = MAX_OPERATIONS_PER_BATCH
): Promise<void> {
  const userRef = collections.users.doc(userId);
  const user = (await userRef.get()).data();
  if (!user) throw new ApiError(400, `The user document with id ${userId} not found.`);
  if (!user.isDeleted)
    throw new ApiError(400, `The user with id ${userId} does not have the deleted flag set.`);
  const workspacesWithUserSnap = await collections.workspaces
    .where("isDeleted", "==", false)
    .or(["userIds", "array-contains", userId], ["invitedUserEmails", "array-contains", user.email])
    .get();
  const workspaceUpdatesPromise = batchUpdateDocs(
    workspacesWithUserSnap.docs.map((snap) => snap.ref),
    {
      userIds: adminArrayRemove<WorkspaceDTO, "userIds">(userId),
      invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(user.email),
      modificationTime: FieldValue.serverTimestamp(),
    },
    maxOperationsPerBatch
  );
  const workspaceSummaryUpdatesPromise = batchUpdateDocs(
    workspacesWithUserSnap.docs.map((snap) => collections.workspaceSummaries.doc(snap.id)),
    {
      userIds: adminArrayRemove<WorkspaceSummaryDTO, "userIds">(userId),
      invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(userId),
      modificationTime: FieldValue.serverTimestamp(),
    },
    maxOperationsPerBatch
  );
  const batch = adminDb.batch();
  batch.delete(userRef);
  batch.delete(collections.userDetails.doc(userId));
  await Promise.all([batch.commit(), workspaceUpdatesPromise, workspaceSummaryUpdatesPromise]);
}
