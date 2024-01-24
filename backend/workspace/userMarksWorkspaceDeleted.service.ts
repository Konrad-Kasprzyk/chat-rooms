import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Marks the workspace deleted.
 * @throws {ApiError} When the workspace document is not found, is not placed in the recycle bin
 * or has the deleted flag set already.
 * When the user document is not found or has the deleted flag set.
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
    if (user.isDeleted)
      throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
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
    transaction.update(workspaceRef, {
      modificationTime: FieldValue.serverTimestamp(),
      isDeleted: true,
    });
    transaction.update(workspaceSummaryRef, {
      modificationTime: FieldValue.serverTimestamp(),
      isDeleted: true,
    });
  });
}
