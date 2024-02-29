import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import ApiError from "common/types/apiError.class";

/**
 * Uncovers a hidden workspace invitation if the user is invited to the workspace.
 * @throws {ApiError} When the user document is not found or has the deleted flag set.
 * When the user details document is not found or has the deleted flag set.
 * When the user is not invited to the provided workspace.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 */
export default async function uncoverWorkspaceInvitation(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userPromise = collections.users.doc(uid).get();
  const userDetailsPromise = collections.userDetails.doc(uid).get();
  const workspacePromise = collections.workspaces.doc(workspaceId).get();
  await Promise.all([userPromise, workspacePromise, userDetailsPromise]);
  const user = (await userPromise).data();
  if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
  if (user.isDeleted) throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
  const userDetails = (await userDetailsPromise).data();
  if (!userDetails)
    throw new ApiError(
      500,
      `The user details document with id ${uid} not found, but found the user document.`
    );
  if (userDetails.isDeleted)
    throw new ApiError(
      500,
      `The user details document with id ${uid} has the deleted flag set, ` +
        `but the user document does not have the deleted flag set.`
    );
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
  await collections.userDetails.doc(uid).update({
    hiddenWorkspaceInvitationIds: adminArrayRemove<UserDetailsDTO, "hiddenWorkspaceInvitationIds">(
      workspaceId
    ),
  });
}
