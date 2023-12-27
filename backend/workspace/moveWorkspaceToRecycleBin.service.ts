import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Marks the workspace as put in the recycle bin if it is not already there.
 * @throws {ApiError} When the workspace document is not found or is in the recycle bin already.
 * When the document of the user using the api is not found or has the deleted flag set.
 * When the user using the api does not belong to the workspace
 */
export default async function moveWorkspaceToRecycleBin(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  /**
   * The transaction prevents new users from being invited and modifying the workspace
   * when it is put to the recycle bin.
   */
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const workspacePromise = transaction.get(workspaceRef);
    await Promise.all([userPromise, workspacePromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    if (user.isDeleted)
      throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
    const workspace = (await workspacePromise).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    if (workspace.isDeleted)
      throw new ApiError(400, `The workspace with id ${workspaceId} has the deleted flag set.`);
    if (workspace.isInBin)
      throw new ApiError(
        400,
        `The workspace with id ${workspaceId} is in the recycle bin already.`
      );
    transaction.update(workspaceRef, {
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
      insertedIntoBinByUserId: uid,
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
      insertedIntoBinByUserId: uid,
    });
  });
}
