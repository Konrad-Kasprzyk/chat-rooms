import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Accepts a user workspace invitation if the user is invited to the workspace.
 * @throws {ApiError} When the user is not invited to the provided workspace.
 * When the user document is not found. When the workspace document is not found,
 * is placed in the recycle bin or has the deleted flag set.
 */
export default async function acceptWorkspaceInvitation(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const userDetailsRef = collections.userDetails.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  /**
   * Transaction prevents cancelling a user invitation, putting the workspace into the recycle bin
   * and marking the workspace as deleted when the user wants to accept the invitation.
   * It is possible that the user will save the workspace id in the list of belonging workspaces
   * when the invitation was cancelled.
   */
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const userDetailsPromise = transaction.get(userDetailsRef);
    const workspacePromise = transaction.get(workspaceRef);
    await Promise.all([userPromise, userDetailsPromise, workspacePromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    const userDetails = (await userDetailsPromise).data();
    if (!userDetails)
      throw new ApiError(
        500,
        `Found the user document, but the user details document with id ${uid} is not found.`
      );
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
    transaction.update(userRef, {
      workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
      workspaceIds: adminArrayUnion<UserDTO, "workspaceIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.userDetails.doc(uid), {
      hiddenWorkspaceInvitationIds: adminArrayRemove<
        UserDetailsDTO,
        "hiddenWorkspaceInvitationIds"
      >(workspaceId),
    });
    transaction.update(collections.userDetails.doc(userDetails.mainUserId), {
      allLinkedUserBelongingWorkspaceIds: adminArrayUnion<
        UserDetailsDTO,
        "allLinkedUserBelongingWorkspaceIds"
      >(workspaceId),
    });
    transaction.update(workspaceRef, {
      invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(user.email),
      userIds: adminArrayUnion<WorkspaceDTO, "userIds">(uid),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(uid),
      userIds: adminArrayUnion<WorkspaceSummaryDTO, "userIds">(uid),
      modificationTime: FieldValue.serverTimestamp(),
    });
    addHistoryRecord<UsersHistoryDTO>(
      transaction,
      usersHistory,
      {
        action: "userIds" as const,
        userId: uid,
        oldValue: null,
        value: uid,
      },
      collections.userHistories
    );
  });
}
