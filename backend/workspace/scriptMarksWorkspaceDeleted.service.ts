import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { WORKSPACE_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Marks the workspace deleted.
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
    if (!workspace.insertedIntoBinByUserId)
      throw new ApiError(
        500,
        `The workspace with id ${workspaceId} is in the recycle bin, but does not have ` +
          `a user id of the user who placed it in the recycle bin.`
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
    transaction.update(workspaceRef, {
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
    });
    transaction.update(workspaceSummaryRef, {
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
    });
  });
}
