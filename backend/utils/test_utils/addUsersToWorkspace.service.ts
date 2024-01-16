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
 * Adds provided user ids to the workspace and invites provided emails to the workspace.
 * @throws {ApiError} When the number of user ids exceeds 10 or the number of user emails exceeds 10.
 * When the workspace is not found or has the deleted flag set. When any of the
 * user documents from provided ids or emails are not found or have the deleted flag set.
 */
export default async function addUsersToWorkspace(
  userIds: string[],
  userEmails: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  if (userIds.length == 0 && userEmails.length == 0) return;
  if (userIds.length > 10)
    throw new ApiError(400, "The number of user ids to add to the workspace exceeds 10");
  if (userEmails.length > 10)
    throw new ApiError(400, "The number of user emails to invite to the workspace exceeds 10");
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  if (workspace.isDeleted)
    throw new ApiError(400, `The workspace with id ${workspaceId} has the deleted flag set.`);
  const userIdsToAdd = userIds.filter((uid) => !workspace.userIds.includes(uid));
  const userEmailsToInvite = userEmails.filter(
    (email) => !workspace.invitedUserEmails.includes(email)
  );
  let usersToAdd: User[] = [];
  if (userIdsToAdd.length > 0) {
    const usersToAddSnap = await testCollections.users.where("id", "in", userIdsToAdd).get();
    usersToAdd = usersToAddSnap.docs.map((docSnap) => docSnap.data());
  }
  let usersToInvite: User[] = [];
  if (userEmailsToInvite.length > 0) {
    const usersToInviteSnap = await testCollections.users
      .where("email", "in", userEmailsToInvite)
      .get();
    usersToInvite = usersToInviteSnap.docs.map((docSnap) => docSnap.data());
  }
  const batch = adminDb.batch();
  for (const userToAdd of usersToAdd) {
    if (userToAdd.isDeleted)
      throw new ApiError(400, `The user with id ${userToAdd.id} has the deleted flag set.`);
    batch.update(testCollections.users.doc(userToAdd.id), {
      workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceId),
      workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(testCollections.userDetails.doc(userToAdd.id), {
      hiddenWorkspaceInvitationsIds: adminArrayRemove<UserDetails, "hiddenWorkspaceInvitationsIds">(
        workspaceId
      ),
    });
  }
  for (const userToInvite of usersToInvite) {
    if (userToInvite.isDeleted)
      throw new ApiError(
        400,
        `The user with email ${userToInvite.email} has the deleted flag set.`
      );
    batch.update(testCollections.users.doc(userToInvite.id), {
      workspaceInvitationIds: adminArrayUnion<User, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  }
  const workspaceSummaryRef = testCollections.workspaceSummaries.doc(workspaceId);
  if (userIdsToAdd.length > 0) {
    batch.update(workspaceRef, {
      userIds: adminArrayUnion<Workspace, "userIds">(...userIdsToAdd),
      invitedUserEmails: adminArrayRemove<Workspace, "invitedUserEmails">(
        ...usersToAdd.map((user) => user.email)
      ),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(workspaceSummaryRef, {
      userIds: adminArrayUnion<WorkspaceSummary, "userIds">(...userIdsToAdd),
      invitedUserEmails: adminArrayRemove<WorkspaceSummary, "invitedUserEmails">(
        ...usersToAdd.map((user) => user.email)
      ),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  }
  if (userEmailsToInvite.length > 0) {
    batch.update(workspaceRef, {
      invitedUserEmails: adminArrayUnion<Workspace, "invitedUserEmails">(...userEmailsToInvite),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(workspaceSummaryRef, {
      invitedUserEmails: adminArrayUnion<WorkspaceSummary, "invitedUserEmails">(
        ...userEmailsToInvite
      ),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  }
  await batch.commit();
}
