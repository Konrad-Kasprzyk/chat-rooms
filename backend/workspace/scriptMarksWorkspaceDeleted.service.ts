import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDTO from "common/DTOModels/userDTO.model";
import { WORKSPACE_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Marks the workspace and workspace summary documents as deleted. Removes the workspace id from the
 * belonging and invited users documents.
 * @throws {ApiError} When the workspace document is not found, is not placed in the recycle bin
 * or has the deleted flag set already.
 */
export default async function scriptMarksWorkspaceDeleted(
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
  /**
   * The transaction prevents modifying the workspace when it is being marked as deleted.
   */
  await adminDb.runTransaction(async (transaction) => {
    const workspace = (await transaction.get(workspaceRef)).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    if (!workspace.isInBin)
      throw new ApiError(400, `The workspace with id ${workspaceId} is not in the recycle bin.`);
    if (!workspace.placingInBinTime)
      throw new ApiError(
        500,
        `The workspace with id ${workspaceId} is in the recycle bin, but does not have ` +
          `a time set when it was placed in the recycle bin.`
      );
    if (workspace.invitedUserEmails.length > 0)
      throw new ApiError(
        500,
        `The workspace with id ${workspaceId} is in the recycle bin, but still has invited users.`
      );
    if (workspace.isDeleted)
      throw new ApiError(
        400,
        `The workspace with id ${workspaceId} has the deleted flag set already.`
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
    /**
     * A user document typically weighs less than 1kB, so it is safe to retrieve and update all
     * users in a single transaction. The transaction update limit is 10MiB.
     */
    const workspaceUsers = await transaction.get(
      collections.users.where("workspaceIds", "array-contains", workspaceId)
    );
    for (const userSnap of workspaceUsers.docs)
      transaction.update(userSnap.ref, {
        workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(workspaceId),
        modificationTime: FieldValue.serverTimestamp(),
      });
    transaction.update(workspaceRef, {
      userIds: [],
      modificationTime: FieldValue.serverTimestamp(),
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp(),
    });
    transaction.update(workspaceSummaryRef, {
      userIds: [],
      modificationTime: FieldValue.serverTimestamp(),
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp(),
    });
  });
}
