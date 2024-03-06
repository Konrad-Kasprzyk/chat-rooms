import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Invites the user to the workspace if the user has not been invited to it.
 * @throws {ApiError} When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 * When the document of the user using the api is not found.
 * When the user using the api does not belong to the workspace.
 * When the target user document is not found.
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
  const targetUserQuery = collections.users.where("email", "==", targetUserEmail);
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
    const usersHistoryRef = collections.userHistories.doc(workspace.newestUsersHistoryId);
    const usersHistory = (await transaction.get(usersHistoryRef)).data();
    if (!usersHistory)
      throw new ApiError(
        500,
        `Found the workspace document, but couldn't find the workspace users history document ` +
          `with id ${workspace.newestUsersHistoryId}`
      );
    assertWorkspaceWriteable(workspace, userUsingApi);
    const targetUserSnaps = await targetUsersPromise;
    if (targetUserSnaps.size == 0)
      throw new ApiError(400, `The user document with email ${targetUserEmail} not found.`);
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
    addHistoryRecord<UsersHistoryDTO>(
      transaction,
      usersHistory,
      {
        action: "invitedUserEmails" as const,
        userId: uid,
        oldValue: null,
        value: targetUserEmail,
      },
      collections.userHistories
    );
  });
}
