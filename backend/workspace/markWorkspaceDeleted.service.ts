import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { WORKSPACE_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Marks the workspace deleted if it has been long enough in the recycle bin
 * or there are no belonging and invited users. If the workspace is not in the recycle bin
 * the workspace is also marked as put in the recycle bin.
 * @throws {ApiError} When the workspace document is not found or has a deleted flag set already.
 * When the workspace has not been long enough in the recycle bin and has belonging or invited users.
 */
export default async function markWorkspaceDeleted(
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
  const invitedUsersQuery = collections.users.where(
    "workspaceInvitationIds",
    "array-contains",
    workspaceId
  );
  const invitedUserDetailsQuery = collections.userDetails.where(
    "hiddenWorkspaceInvitationsIds",
    "array-contains",
    workspaceId
  );
  /**
   * Transaction prevents invited users to accept and hide the workspace invitation.
   * It is possible that a user will save the workspace id in the list of belonging workspaces
   * or hidden invitations when the workspace has been marked as deleted.
   */
  await adminDb.runTransaction(async (transaction) => {
    const workspacePromise = transaction.get(workspaceRef);
    const invitedUsersPromise = transaction.get(invitedUsersQuery);
    const invitedUserDetailsPromise = transaction.get(invitedUserDetailsQuery);
    await Promise.all([workspacePromise, invitedUsersPromise, invitedUserDetailsPromise]);
    const workspace = (await workspacePromise).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    if (workspace.isDeleted)
      throw new ApiError(
        400,
        `The workspace with id ${workspaceId} has the deleted flag set already.`
      );
    if (workspace.userIds.length > 0 || workspace.invitedUserEmails.length > 0) {
      if (!workspace.isInBin)
        throw new ApiError(400, `The workspace with id ${workspaceId} is not in the recycle bin.`);
      if (!workspace.placingInBinTime)
        throw new ApiError(
          500,
          `The workspace with id ${workspaceId} is in the recycle bin, but does not have ` +
            `a time set when it was placed in the recycle bin.`
        );
      const placingInBinTime = workspace.placingInBinTime.toDate();
      const deletionTime = new Date(
        placingInBinTime.getTime() + WORKSPACE_DAYS_IN_BIN * 24 * 60 * 60 * 1000
      );
      if (deletionTime > new Date())
        throw new ApiError(
          400,
          `Workspace with id ${workspaceId} is not long enough in the recycle bin.`
        );
    }
    if (!workspace.isInBin) {
      transaction.update(workspaceRef, {
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
        isInBin: true,
        placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
        insertedIntoBinByUserId: null,
        isDeleted: true,
        deletionTime: FieldValue.serverTimestamp() as Timestamp,
      });
      transaction.update(workspaceSummaryRef, {
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
        isInBin: true,
        placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
        insertedIntoBinByUserId: null,
        isDeleted: true,
        deletionTime: FieldValue.serverTimestamp() as Timestamp,
      });
    } else {
      transaction.update(workspaceRef, {
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
        isDeleted: true,
        deletionTime: FieldValue.serverTimestamp() as Timestamp,
      });
      transaction.update(workspaceSummaryRef, {
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
        isDeleted: true,
        deletionTime: FieldValue.serverTimestamp() as Timestamp,
      });
    }
  });
}
