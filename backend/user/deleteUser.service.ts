import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminAuth from "backend/db/adminAuth.firebase";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Deletes the user document, removes the user from workspaces documents and deletes the user account.
 * @throws {ApiError} When the provided uid is empty.
 */
export default async function deleteUser(
  uid: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  if (!uid) throw new ApiError(400, "Uid is not a non-empty string.");
  const userRef = collections.users.doc(uid);
  const workspacesWithUserQuery = collections.workspaces.or(
    ["userIds", "array-contains", uid],
    ["invitedUserIds", "array-contains", uid]
  );
  const workspaceSummariesWithUserQuery = collections.workspaceSummaries.or(
    ["userIds", "array-contains", uid],
    ["invitedUserIds", "array-contains", uid]
  );

  /**
   * Must use transaction, because firestore can't do batch updates with queries.
   * Have to get all the documents from the queries, and then perform the update on each id separately.
   * A transaction ensures that all documents from the queries are updated.
   */
  await adminDb.runTransaction(async (transaction) => {
    const promises = [];
    const userPromise = transaction.get(userRef);
    const workspacesPromise = transaction.get(workspacesWithUserQuery);
    const workspaceSummariesPromise = transaction.get(workspaceSummariesWithUserQuery);
    promises.push(userPromise);
    promises.push(workspacesPromise);
    promises.push(workspaceSummariesPromise);
    await Promise.all(promises);
    transaction.delete(userRef);
    const workspacesSnap = await workspacesPromise;
    const workspaceSummariesSnap = await workspaceSummariesPromise;
    for (const workspaceSnap of workspacesSnap.docs)
      transaction.update(workspaceSnap.ref, {
        userIds: adminArrayRemove<Workspace, "userIds">(uid),
        invitedUserIds: adminArrayRemove<Workspace, "invitedUserIds">(uid),
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
      });
    for (const workspaceSummarySnap of workspaceSummariesSnap.docs)
      transaction.update(workspaceSummarySnap.ref, {
        userIds: adminArrayRemove<WorkspaceSummary, "userIds">(uid),
        invitedUserIds: adminArrayRemove<WorkspaceSummary, "invitedUserIds">(uid),
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
      });
  });
  await adminAuth.deleteUser(uid);
}
