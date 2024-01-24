import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Rejects a user workspace invitation if the user is invited to the workspace.
 * @throws {ApiError} When the user is not invited to the provided workspace.
 * When the user document is not found or has the deleted flag set.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 */
export default async function rejectWorkspaceInvitation(
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
  const workspace = (await workspacePromise).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  if (workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspaceId} is in the recycle bin.`);
  if (workspace.isDeleted)
    throw new ApiError(
      500,
      `The workspace with id ${workspace.id} has the deleted flag set, but is not in the recycle bin.`
    );
  if (
    !user.workspaceInvitationIds.includes(workspaceId) ||
    !workspace.invitedUserEmails.includes(user.email)
  )
    throw new ApiError(
      400,
      `The user with id ${uid} is not invited to the workspace with id ${workspaceId}`
    );
  const batch = adminDb.batch();
  batch.update(userRef, {
    workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(collections.userDetails.doc(uid), {
    hiddenWorkspaceInvitationIds: adminArrayRemove<UserDetailsDTO, "hiddenWorkspaceInvitationIds">(
      workspaceId
    ),
  });
  batch.update(workspaceRef, {
    invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(user.email),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(collections.workspaceSummaries.doc(workspaceId), {
    invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(uid),
    modificationTime: FieldValue.serverTimestamp(),
  });
  await batch.commit();
}
