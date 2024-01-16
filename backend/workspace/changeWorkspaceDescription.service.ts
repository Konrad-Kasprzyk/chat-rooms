import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Changes the workspace description if the user belongs to it
 * @throws {ApiError} When the user document is not found.
 * When the user does not belong to the workspace or has the deleted flag set.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
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
  const workspace = (await workspaceRef.get()).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  assertWorkspaceWriteable(workspace, user);
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
