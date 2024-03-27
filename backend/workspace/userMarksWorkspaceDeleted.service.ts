import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDTO from "common/DTOModels/userDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Marks the workspace and workspace summary documents as deleted. Removes the workspace id from the
 * belonging and invited users documents.
 * @throws {ApiError} When the workspace document is not found, is not placed in the recycle bin
 * or has the deleted flag set already.
 * When the user document is not found.
 */
export default async function userMarksWorkspaceDeleted(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
  /**
   * The transaction prevents modifying the workspace when it is being marked as deleted.
   */
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const workspacePromise = transaction.get(workspaceRef);
    await Promise.all([userPromise, workspacePromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
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
    if (!workspace.userIds.includes(uid) || !user.workspaceIds.includes(workspace.id))
      throw new ApiError(
        400,
        `The user with id ${uid} doesn't belong to the workspace with id ${workspace.id}`
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
