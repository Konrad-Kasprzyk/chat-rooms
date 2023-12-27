import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDetails from "common/models/userDetails.model";
import ApiError from "common/types/apiError.class";

/**
 * Hides a user workspace invitation if the user is invited to the workspace.
 * @throws {ApiError} When the user document is not found or has the deleted flag set.
 * When the user details document is not found.
 * When the user is not invited to the provided workspace.
 * When the workspace document is not found or has the deleted flag set.
 */
export default async function hideWorkspaceInvitation(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const userDetailsRef = collections.userDetails.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  /**
   * Transaction prevents cancelling a user invitation and marking the workspace as deleted when
   * the user wants to hide the invitation.
   * It is possible that the user will save the workspace id in the list of hidden workspace invitations
   * when the invitation was cancelled or the workspace was marked as deleted.
   */
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const userDetailsPromise = transaction.get(userDetailsRef);
    const workspacePromise = transaction.get(workspaceRef);
    await Promise.all([userPromise, userDetailsPromise, workspacePromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    if (user.isDeleted)
      throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
    const userDetails = (await userDetailsPromise).data();
    if (!userDetails)
      throw new ApiError(400, `The user details document with id ${uid} not found.`);
    const workspace = (await workspacePromise).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    if (workspace.isDeleted)
      throw new ApiError(400, `The workspace with id ${workspaceId} has the deleted flag set.`);
    if (
      !user.workspaceInvitationIds.includes(workspaceId) ||
      !workspace.invitedUserEmails.includes(user.email)
    )
      throw new ApiError(
        400,
        `The user with id ${uid} is not invited to the workspace with id ${workspaceId}`
      );
    transaction.update(userDetailsRef, {
      hiddenWorkspaceInvitationsIds: adminArrayUnion<UserDetails, "hiddenWorkspaceInvitationsIds">(
        workspaceId
      ),
    });
  });
}
