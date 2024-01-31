import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import UserDTO from "common/DTOModels/userDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Removes the provided user from the workspace.
 * @throws {ApiError} When the user does not belong to the provided workspace.
 * When the user document is not found or has the deleted flag set.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 */
export default async function leaveWorkspace(
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
  const workspace = (await workspacePromise).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  assertWorkspaceWriteable(workspace, user);
  const batch = adminDb.batch();
  batch.update(userRef, {
    workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(workspaceId),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(workspaceRef, {
    userIds: adminArrayRemove<WorkspaceDTO, "userIds">(uid),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(collections.workspaceSummaries.doc(workspaceId), {
    userIds: adminArrayRemove<WorkspaceSummaryDTO, "userIds">(uid),
    modificationTime: FieldValue.serverTimestamp(),
  });
  await batch.commit();
}
