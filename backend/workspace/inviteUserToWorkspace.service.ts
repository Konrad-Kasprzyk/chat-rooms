import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import UserDTO from "common/DTOModels/userDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import MAX_INVITED_USERS from "common/constants/maxInvitedUsers.constant";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Invites the user to the workspace if the user has not been invited to it.
 * @throws {ApiError} When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 * When the document of the user using the api is not found or has the deleted flag set.
 * When the user using the api does not belong to the workspace.
 * When the target user document is not found or has the deleted flag set.
 * When the target user is invited to the workspace already.
 */
export default async function inviteUserToWorkspace(
  uid: string,
  workspaceId: string,
  targetUserEmail: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userUsingApiRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const targetUserQuery = collections.users
    .where("email", "==", targetUserEmail)
    .where("isDeleted", "==", false);
  /**
   * Transaction prevents the user from being invited again and placing the workspace in the
   * recycle bin when the user wants to accept the invitation.
   * It is possible that the user will save the workspace id in the list of belonging workspaces
   * when the invitation has been added to the list of invited workspaces or the workspace has
   * been put in the recycle bin.
   */
  await adminDb.runTransaction(async (transaction) => {
    const userUsingApiPromise = transaction.get(userUsingApiRef);
    const workspacePromise = transaction.get(workspaceRef);
    const targetUsersPromise = transaction.get(targetUserQuery);
    await Promise.all([userUsingApiPromise, workspacePromise, targetUsersPromise]);
    const userUsingApi = (await userUsingApiPromise).data();
    if (!userUsingApi)
      throw new ApiError(400, `The document of user using the api with id ${uid} not found.`);
    const workspace = (await workspacePromise).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    assertWorkspaceWriteable(workspace, userUsingApi);
    if (workspace.invitedUserEmails.length >= MAX_INVITED_USERS)
      throw new ApiError(
        400,
        `The workspace with id ${workspaceId} has a maximum number of invited users.`
      );
    const targetUserSnaps = await targetUsersPromise;
    if (targetUserSnaps.size == 0)
      throw new ApiError(
        400,
        `The user document with email ${targetUserEmail} not found or has the deleted flag set.`
      );
    if (targetUserSnaps.size > 1)
      throw new ApiError(500, `Found multiple user documents with email ${targetUserEmail}`);
    const targetUser = targetUserSnaps.docs[0].data();
    if (
      targetUser.workspaceInvitationIds.includes(workspaceId) ||
      workspace.invitedUserEmails.includes(targetUserEmail)
    )
      throw new ApiError(
        400,
        `The user with email ${targetUserEmail} is already invited to the workspace with id ${workspaceId}`
      );
    transaction.update(collections.users.doc(targetUser.id), {
      workspaceInvitationIds: adminArrayUnion<UserDTO, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(workspaceRef, {
      invitedUserEmails: adminArrayUnion<WorkspaceDTO, "invitedUserEmails">(targetUserEmail),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      invitedUserIds: adminArrayUnion<WorkspaceSummaryDTO, "invitedUserIds">(targetUser.id),
      modificationTime: FieldValue.serverTimestamp(),
    });
  });
}
