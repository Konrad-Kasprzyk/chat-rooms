import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Changes the workspace description if the user belongs to it
 * @throws {ApiError} When the user document is not found.
 * When the user does not belong to the workspace or has the deleted flag set.
 * When the workspace document is not found or is in the recycle bin.
 */
export default async function changeWorkspaceDescription(
  uid: string,
  workspaceId: string,
  newDescription: string,
  collections: typeof adminCollections = adminCollections
) {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const userPromise = userRef.get();
  const workspacePromise = workspaceRef.get();
  await Promise.all([userPromise, workspacePromise]);
  const user = (await userPromise).data();
  if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
  if (user.isDeleted) throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  if (workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspaceId} is in the recycle bin.`);
  if (!workspace.userIds.includes(uid) || !user.workspaceIds.includes(workspaceId))
    throw new ApiError(
      400,
      `The user with id ${uid} doesn't belong to the workspace with id ${workspaceId}`
    );
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
  const batch = adminDb.batch();
  batch.update(workspaceRef, {
    description: newDescription,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  batch.update(workspaceSummaryRef, {
    description: newDescription,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  await batch.commit();
}
