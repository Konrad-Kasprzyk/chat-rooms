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
  const userDetailsRef = collections.userDetails.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
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
    if (user.isDeleted)
      throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
    const workspace = (await workspacePromise).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    if (workspace.isDeleted)
      throw new ApiError(400, `The workspace with id ${workspaceId} has the deleted flag set.`);
    if (!workspace.userIds.includes(uid) || !user.workspaceIds.includes(workspaceId))
      throw new ApiError(
        400,
        `The user with id ${uid} doesn't belong to the workspace with id ${workspaceId}`
      );
    transaction.update(userRef, {
      workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    const workspaceUserIdsAfterLeave = workspace.userIds.filter((userId) => userId != uid);
    if (
      !workspaceUserIdsAfterLeave.some((userId) =>
        userDetails.linkedUserDocumentIds.includes(userId)
      )
    )
      transaction.update(collections.userDetails.doc(userDetails.mainUserId), {
        allLinkedUserBelongingWorkspaceIds: adminArrayRemove<
          UserDetailsDTO,
          "allLinkedUserBelongingWorkspaceIds"
        >(workspaceId),
      });
    transaction.update(workspaceRef, {
      userIds: adminArrayRemove<WorkspaceDTO, "userIds">(uid),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      userIds: adminArrayRemove<WorkspaceSummaryDTO, "userIds">(uid),
      modificationTime: FieldValue.serverTimestamp(),
    });
  });
}
