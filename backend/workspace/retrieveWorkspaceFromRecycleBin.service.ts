import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Removes the marking of the workspace as being put in the recycle bin.
 * @throws {ApiError} When the workspace document is not found, is not placed in the recycle bin
 * or has the deleted flag set.
 * When the document of the user using the api is not found or has the deleted flag set.
 * When the user using the api does not belong to the workspace
 */
export default async function retrieveWorkspaceFromRecycleBin(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const userPromise = userRef.get();
  const workspacePromise = workspaceRef.get();
  await Promise.all([userPromise, workspacePromise]);
  const user = (await userPromise).data();
  if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
  if (user.isDeleted) throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  if (workspace.isDeleted)
    throw new ApiError(400, `The workspace with id ${workspaceId} has the deleted flag set.`);
  if (!workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspaceId} is not in the recycle bin.`);
  if (!workspace.userIds.includes(uid) || !user.workspaceIds.includes(workspaceId))
    throw new ApiError(
      400,
      `The user with id ${uid} doesn't belong to the workspace with id ${workspaceId}`
    );
  const batch = adminDb.batch();
  batch.update(workspaceRef, {
    modificationTime: FieldValue.serverTimestamp(),
    isInBin: false,
    placingInBinTime: null,
  });
  batch.update(collections.workspaceSummaries.doc(workspaceId), {
    modificationTime: FieldValue.serverTimestamp(),
    isInBin: false,
    placingInBinTime: null,
  });
  await batch.commit();
}
