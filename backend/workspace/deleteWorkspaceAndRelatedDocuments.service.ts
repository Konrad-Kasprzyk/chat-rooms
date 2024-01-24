import batchUpdateDocs from "backend/batchUpdateDocs.util";
import MAX_OPERATIONS_PER_BATCH from "backend/constants/maxOperationsPerBatch.constant";
import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import batchDeleteDocs from "../batchDeleteDocs.util";

/**
 * This function deletes a workspace and all related documents from Firestore.
 * Including tasks, goals, norms, etc. This function removes workspace id from users documents.
 * @throws {ApiError} When the workspace document is not found, is not placed in the recycle bin
 * or has not the deleted flag set.
 */
export default async function deleteWorkspaceAndRelatedDocuments(
  workspaceId: string,
  collections: typeof adminCollections = adminCollections,
  maxOperationsPerBatch: number = MAX_OPERATIONS_PER_BATCH
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
  const usersWithWorkspaceIdSnap = await collections.users
    .where("isDeleted", "==", false)
    .or(
      ["workspaceIds", "array-contains", workspaceId],
      ["workspaceInvitationIds", "array-contains", workspaceId]
    )
    .get();
  const userUpdatesPromise = batchUpdateDocs(
    usersWithWorkspaceIdSnap.docs.map((snap) => collections.users.doc(snap.id)),
    {
      workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(workspaceId),
      workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    },
    maxOperationsPerBatch
  );
  const userDetailUpdatesPromise = batchUpdateDocs(
    usersWithWorkspaceIdSnap.docs.map((snap) => collections.userDetails.doc(snap.id)),
    {
      hiddenWorkspaceInvitationIds: adminArrayRemove<
        UserDetailsDTO,
        "hiddenWorkspaceInvitationIds"
      >(workspaceId),
    },
    maxOperationsPerBatch
  );
  // Delete workspace and all related documents
  const workspaceTasksPromise = collections.tasks.where("workspaceId", "==", workspaceId).get();
  const workspaceGoalsPromise = collections.goals.where("workspaceId", "==", workspaceId).get();
  await Promise.all([workspaceTasksPromise, workspaceGoalsPromise]);
  const docSnapsToDelete = [
    ...(await workspaceTasksPromise).docs,
    ...(await workspaceGoalsPromise).docs,
  ];
  const docRefsToDelete = docSnapsToDelete.map((docSnap) => docSnap.ref);
  const workspaceDocsDeletionPromise = batchDeleteDocs(docRefsToDelete, maxOperationsPerBatch);
  const batch = adminDb.batch();
  batch.delete(collections.workspaces.doc(workspaceId));
  batch.delete(collections.workspaceSummaries.doc(workspaceId));
  batch.delete(collections.workspaceCounters.doc(workspaceId));
  await Promise.all([
    batch.commit(),
    userUpdatesPromise,
    userDetailUpdatesPromise,
    workspaceDocsDeletionPromise,
  ]);
}
