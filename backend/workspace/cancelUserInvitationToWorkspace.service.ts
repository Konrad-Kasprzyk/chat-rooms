import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Cancels the user invitation to the workspace if the user has been invited to it.
 * @throws {ApiError} When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 * When the document of the user using the api is not found or has the deleted flag set.
 * When the user using the api does not belong to the workspace.
 * When the target user document is not found or has the deleted flag set.
 * When the target user is not invited to the workspace.
 */
export default async function cancelUserInvitationToWorkspace(
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
  const userUsingApiPromise = userUsingApiRef.get();
  const workspacePromise = workspaceRef.get();
  const targetUsersPromise = targetUserQuery.get();
  await Promise.all([userUsingApiPromise, workspacePromise, targetUsersPromise]);
  const userUsingApi = (await userUsingApiPromise).data();
  if (!userUsingApi)
    throw new ApiError(400, `The document of user using the api with id ${uid} not found.`);
  const workspace = (await workspacePromise).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  assertWorkspaceWriteable(workspace, userUsingApi);
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
    !targetUser.workspaceInvitationIds.includes(workspaceId) ||
    !workspace.invitedUserEmails.includes(targetUserEmail)
  )
    throw new ApiError(
      400,
      `The user with email ${targetUserEmail} is not invited to the workspace with id ${workspaceId}`
    );
  const batch = adminDb.batch();
  batch.update(collections.users.doc(targetUser.id), {
    workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  batch.update(collections.userDetails.doc(targetUser.id), {
    hiddenWorkspaceInvitationsIds: adminArrayRemove<UserDetails, "hiddenWorkspaceInvitationsIds">(
      workspaceId
    ),
  });
  batch.update(workspaceRef, {
    invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(targetUserEmail),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  batch.update(collections.workspaceSummaries.doc(workspaceId), {
    invitedUserEmails: adminArrayRemove<WorkspaceSummary, "invitedUserEmails">(targetUserEmail),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  await batch.commit();
}
