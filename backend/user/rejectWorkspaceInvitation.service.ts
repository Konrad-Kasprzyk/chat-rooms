import adminArrayRemove from "backend/db/adminArrayRemove.util";
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
 * Rejects a user workspace invitation if the user is invited to the workspace.
 * @throws {ApiError} When the user is not invited to the provided workspace.
 * When the user document is not found or has the deleted flag set.
 * When the workspace document is not found or has the deleted flag set.
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
  const batch = adminDb.batch();
  batch.update(userRef, {
    workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  batch.update(collections.userDetails.doc(uid), {
    hiddenWorkspaceInvitationsIds: adminArrayRemove<UserDetails, "hiddenWorkspaceInvitationsIds">(
      workspaceId
    ),
  });
  batch.update(workspaceRef, {
    invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(user.email),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  batch.update(collections.workspaceSummaries.doc(workspaceId), {
    invitedUserEmails: adminArrayRemove<WorkspaceSummary, "invitedUserEmails">(user.email),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  await batch.commit();
}
