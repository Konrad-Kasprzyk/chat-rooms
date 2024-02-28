import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
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
  const userDetailsToRemoveRef = collections.userDetails.doc(userIdToRemove);
  await adminDb.runTransaction(async (transaction) => {
    const userUsingApiPromise = transaction.get(userUsingApiRef);
    const workspacePromise = transaction.get(workspaceRef);
    const userToRemovePromise = transaction.get(userToRemoveRef);
    const userDetailsToRemovePromise = transaction.get(userDetailsToRemoveRef);
    await Promise.all([
      userUsingApiPromise,
      workspacePromise,
      userToRemovePromise,
      userDetailsToRemovePromise,
    ]);
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
    const userToRemove = (await userToRemovePromise).data();
    if (!userToRemove)
      throw new ApiError(
        400,
        `The document of the user with id ${userIdToRemove} to remove from the ` +
          `workspace with id ${workspaceId} not found.`
      );
    const userDetailsToRemove = (await userDetailsToRemovePromise).data();
    if (!userDetailsToRemove)
      throw new ApiError(
        500,
        `Found the document of the user to remove from the workspace, ` +
          `but his user details document with id ${userIdToRemove} is not found.`
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
    transaction.update(userToRemoveRef, {
      workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    const workspaceUserIdsAfterLeave = workspace.userIds.filter(
      (userId) => userId != userIdToRemove
    );
    if (
      !workspaceUserIdsAfterLeave.some((userId) =>
        userDetailsToRemove.linkedUserDocumentIds.includes(userId)
      )
    )
      transaction.update(collections.userDetails.doc(userDetailsToRemove.mainUserId), {
        allLinkedUserBelongingWorkspaceIds: adminArrayRemove<
          UserDetailsDTO,
          "allLinkedUserBelongingWorkspaceIds"
        >(workspaceId),
      });
    transaction.update(workspaceRef, {
      userIds: adminArrayRemove<WorkspaceDTO, "userIds">(userIdToRemove),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      userIds: adminArrayRemove<WorkspaceSummaryDTO, "userIds">(userIdToRemove),
      modificationTime: FieldValue.serverTimestamp(),
    });
    addHistoryRecord<UsersHistoryDTO>(
      transaction,
      usersHistory,
      {
        action: "userRemovedFromWorkspace" as const,
        userId: uid,
        oldValue: {
          id: userToRemove.id,
          email: userToRemove.email,
          username: userToRemove.username,
          isBotUserDocument: userToRemove.isBotUserDocument,
        },
        value: null,
      },
      collections.userHistories
    );
  });
}
