import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Accepts a user workspace invitation if the user is invited to the workspace.
 * @throws {ApiError} When the user is not invited to the provided workspace.
 * When the user document is not found or has the deleted flag set.
 * When the workspace document is not found or has the deleted flag set.
 */
export default async function acceptWorkspaceInvitation(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  /**
   * Transaction prevents cancelling a user invitation and marking the workspace as deleted when
   * the user wants to accept the invitation.
   * It is possible that the user will save the workspace id in the list of belonging workspaces
   * when the invitation was cancelled or the workspace was marked as deleted.
   */
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const workspacePromise = transaction.get(workspaceRef);
    await Promise.all([userPromise, workspacePromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    if (user.isDeleted)
      throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
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
    transaction.update(userRef, {
      workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
      workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    transaction.update(collections.userDetails.doc(uid), {
      hiddenWorkspaceInvitationsIds: adminArrayRemove<UserDetails, "hiddenWorkspaceInvitationsIds">(
        workspaceId
      ),
    });
    transaction.update(workspaceRef, {
      invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(user.email),
      userIds: adminArrayUnion<Workspace, "userIds">(uid),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      invitedUserEmails: adminArrayRemove<WorkspaceSummary, "invitedUserEmails">(user.email),
      userIds: adminArrayUnion<WorkspaceSummary, "userIds">(uid),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  });
}
