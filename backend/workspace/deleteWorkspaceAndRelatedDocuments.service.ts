import batchUpdateDocs from "backend/batchUpdateDocs.util";
import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { DAYS_TO_DELETE_DOC } from "common/constants/timeToDeleteDoc.constant";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import batchDeleteDocs from "../batchDeleteDocs.util";

/**
 * This function deletes a workspace and all related documents from Firestore.
 * Including tasks, goals, norms, etc. This function removes workspace id from users documents.
 * The function does nothing if the workspace document is not found.
 * @throws {string} When the workspace hasn't had the delete flag set long enough.
 */
export default async function deleteWorkspaceAndRelatedDocuments(
  workspaceId: string,
  collections: typeof adminCollections = adminCollections,
  maxOperationsPerBatch: number = 100
): Promise<void> {
  const workspace = (await collections.workspaces.doc(workspaceId).get()).data();
  if (!workspace) return;
  if (!workspace.isDeleted)
    throw new ApiError(
      400,
      `The workspace with id ${workspaceId} does not have the deleted flag set.`
    );
  if (!workspace.deletionTime)
    throw new ApiError(
      500,
      `The workspace with id ${workspaceId} has the deleted flag set, but does not have a time ` +
        `when the deleted flag was set.`
    );
  const markingDeletedTime = workspace.deletionTime.toDate();
  const actualDeletionTime = new Date(
    markingDeletedTime.getTime() + DAYS_TO_DELETE_DOC * 24 * 60 * 60 * 1000
  );
  if (actualDeletionTime > new Date())
    throw new ApiError(
      400,
      `The workspace with id ${workspaceId} does not have the deleted flag set long enough.`
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
      workspaceIds: adminArrayRemove<User, "workspaceIds">(workspaceId),
      workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    },
    maxOperationsPerBatch
  );
  const userDetailUpdatesPromise = batchUpdateDocs(
    usersWithWorkspaceIdSnap.docs.map((snap) => collections.userDetails.doc(snap.id)),
    {
      hiddenWorkspaceInvitationsIds: adminArrayRemove<UserDetails, "hiddenWorkspaceInvitationsIds">(
        workspaceId
      ),
    },
    maxOperationsPerBatch
  );
  // Delete workspace and all related documents
  const docsToDelete = [];
  for (const docsToDeleteQuery of [
    collections.tasks.where("workspaceId", "==", workspaceId),
    collections.goals.where("workspaceId", "==", workspaceId),
    collections.norms.where("workspaceId", "==", workspaceId),
    collections.completedTaskStats.where("workspaceId", "==", workspaceId),
  ]) {
    const docsToDeleteSnap = await docsToDeleteQuery.get();
    for (const docSnap of docsToDeleteSnap.docs) docsToDelete.push(docSnap.ref);
  }
  const workspaceDocsDeletionPromise = batchDeleteDocs(docsToDelete, maxOperationsPerBatch);
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
