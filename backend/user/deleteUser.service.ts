import batchUpdateDocs from "backend/batchUpdateDocs.util";
import MAX_OPERATIONS_PER_BATCH from "backend/constants/maxOperationsPerBatch.constant";
import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminAuth from "backend/db/adminAuth.firebase";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { DAYS_TO_DELETE_DOC } from "common/constants/timeToDeleteDoc.constant";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Deletes user and user details documents, removes the user from workspaces documents
 * and deletes the user account.
 * The function does nothing if the user document is not found.
 * @throws {ApiError} When the user document hasn't had the deleted flag set long enough.
 */
export default async function deleteUser(
  userId: string,
  collections: typeof adminCollections = adminCollections,
  maxOperationsPerBatch: number = MAX_OPERATIONS_PER_BATCH
): Promise<void> {
  const userRef = collections.users.doc(userId);
  const user = (await userRef.get()).data();
  if (!user) return;
  if (!user.isDeleted)
    throw new ApiError(400, `The user with id ${userId} does not have the deleted flag set.`);
  if (!user.deletionTime)
    throw new ApiError(
      500,
      `The user with id ${userId} has the deleted flag set, but does not have a time ` +
        `when the deleted flag was set.`
    );
  const markedDeletedTime = user.deletionTime.toDate();
  const timeToDeleteDoc = new Date(
    markedDeletedTime.getTime() + DAYS_TO_DELETE_DOC * 24 * 60 * 60 * 1000
  );
  if (timeToDeleteDoc > new Date())
    throw new ApiError(
      400,
      `The user with id ${userId} does not have the deleted flag set long enough.`
    );
  const workspacesWithUserSnap = await collections.workspaces
    .where("isDeleted", "==", false)
    .or(["userIds", "array-contains", userId], ["invitedUserEmails", "array-contains", user.email])
    .get();
  const workspaceUpdatesPromise = batchUpdateDocs(
    workspacesWithUserSnap.docs.map((snap) => snap.ref),
    {
      userIds: adminArrayRemove<Workspace, "userIds">(userId),
      invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(user.email),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    },
    maxOperationsPerBatch
  );
  const workspaceSummaryUpdatesPromise = batchUpdateDocs(
    workspacesWithUserSnap.docs.map((snap) => collections.workspaceSummaries.doc(snap.id)),
    {
      userIds: adminArrayRemove<WorkspaceSummary, "userIds">(userId),
      invitedUserEmails: adminArrayRemove<WorkspaceSummary, "invitedUserEmails">(user.email),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    },
    maxOperationsPerBatch
  );
  const batch = adminDb.batch();
  batch.delete(userRef);
  batch.delete(collections.userDetails.doc(userId));
  await Promise.all([batch.commit(), workspaceUpdatesPromise, workspaceSummaryUpdatesPromise]);
  await adminAuth.deleteUser(userId);
}
