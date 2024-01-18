import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import Workspace from "common/models/workspaceModels/workspace.model";
import WorkspaceSummary from "common/models/workspaceModels/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Removes provided user ids from the workspace and cancels provided email invitations to the workspace.
 * @throws {ApiError} When the workspace is not found or has the deleted flag set. When any of the
 * user documents from provided ids or emails are not found or have the deleted flag set.
 */
export default async function removeUsersFromWorkspace(
  userIds: string[],
  userEmails: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  if (userIds.length == 0 && userEmails.length == 0) return;
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  if (workspace.isDeleted)
    throw new ApiError(400, `The workspace with id ${workspaceId} has the deleted flag set.`);
  const userIdsToRemove = userIds.filter((uid) => workspace.userIds.includes(uid));
  const userEmailsToRemove = userEmails.filter((email) =>
    workspace.invitedUserEmails.includes(email)
  );
  let usersToRemove: User[] = [];
  if (userIdsToRemove.length > 0) {
    const usersToRemoveSnap = await testCollections.users.where("id", "in", userIdsToRemove).get();
    usersToRemove = usersToRemoveSnap.docs.map((docSnap) => docSnap.data());
  }
  let usersToCancelInvitation: User[] = [];
  if (userEmailsToRemove.length > 0) {
    const usersToCancelInvitationSnap = await testCollections.users
      .where("email", "in", userEmailsToRemove)
      .get();
    usersToCancelInvitation = usersToCancelInvitationSnap.docs.map((docSnap) => docSnap.data());
  }
  const batch = adminDb.batch();
  for (const userToRemove of usersToRemove) {
    if (userToRemove.isDeleted)
      throw new ApiError(400, `The user with id ${userToRemove.id} has the deleted flag set.`);
    batch.update(testCollections.users.doc(userToRemove.id), {
      workspaceIds: adminArrayRemove<User, "workspaceIds">(workspaceId),
      workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(testCollections.userDetails.doc(userToRemove.id), {
      hiddenWorkspaceInvitationsIds: adminArrayRemove<UserDetails, "hiddenWorkspaceInvitationsIds">(
        workspaceId
      ),
    });
  }
  for (const userToCancelInvitation of usersToCancelInvitation) {
    if (userToCancelInvitation.isDeleted)
      throw new ApiError(
        400,
        `The user with email ${userToCancelInvitation.email} has the deleted flag set.`
      );
    batch.update(testCollections.users.doc(userToCancelInvitation.id), {
      workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(testCollections.userDetails.doc(userToCancelInvitation.id), {
      hiddenWorkspaceInvitationsIds: adminArrayRemove<UserDetails, "hiddenWorkspaceInvitationsIds">(
        workspaceId
      ),
    });
  }
  const workspaceSummaryRef = testCollections.workspaceSummaries.doc(workspaceId);
  if (userIdsToRemove.length > 0) {
    batch.update(workspaceRef, {
      userIds: adminArrayRemove<Workspace, "userIds">(...userIdsToRemove),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(workspaceSummaryRef, {
      userIds: adminArrayRemove<WorkspaceSummary, "userIds">(...userIdsToRemove),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  }
  if (userEmailsToRemove.length > 0) {
    batch.update(workspaceRef, {
      invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(...userEmailsToRemove),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(workspaceSummaryRef, {
      invitedUserEmails: adminArrayRemove<WorkspaceSummary, "invitedUserEmails">(
        ...userEmailsToRemove
      ),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  }
  await batch.commit();
}
