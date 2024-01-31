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
 * Removes the user from the workspace
 * @throws {ApiError} When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 * When the document of the user using the api is not found or has the deleted flag set.
 * When the user using the api does not belong to the workspace.
 * When the target user document is not found or has the deleted flag set.
 * When the target user does not belong to the workspace.
 */
export default async function removeUserFromWorkspace(
  uid: string,
  workspaceId: string,
  userIdToRemove: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userUsingApiRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const userToRemoveRef = collections.users.doc(userIdToRemove);
  const userUsingApiPromise = userUsingApiRef.get();
  const workspacePromise = workspaceRef.get();
  const userToRemovePromise = userToRemoveRef.get();
  await Promise.all([userUsingApiPromise, workspacePromise, userToRemovePromise]);
  const userUsingApi = (await userUsingApiPromise).data();
  if (!userUsingApi)
    throw new ApiError(400, `The document of user using the api with id ${uid} not found.`);
  const workspace = (await workspacePromise).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  assertWorkspaceWriteable(workspace, userUsingApi);
  const userToRemove = (await userToRemovePromise).data();
  if (!userToRemove)
    throw new ApiError(
      400,
      `The document of the user with id ${userIdToRemove} to remove from the ` +
        `workspace with id ${workspaceId} not found.`
    );
  if (
    !userToRemove.workspaceIds.includes(workspaceId) ||
    !workspace.userIds.includes(userIdToRemove)
  )
    throw new ApiError(
      400,
      `The user with id ${userIdToRemove} to remove from the workspace with ` +
        `id ${workspaceId} does not belong to it.`
    );
  const batch = adminDb.batch();
  batch.update(userToRemoveRef, {
    workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(workspaceId),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(workspaceRef, {
    userIds: adminArrayRemove<WorkspaceDTO, "userIds">(userIdToRemove),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(collections.workspaceSummaries.doc(workspaceId), {
    userIds: adminArrayRemove<WorkspaceSummaryDTO, "userIds">(userIdToRemove),
    modificationTime: FieldValue.serverTimestamp(),
  });
  await batch.commit();
}
