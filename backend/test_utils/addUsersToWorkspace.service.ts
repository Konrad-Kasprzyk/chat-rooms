import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Adds provided users to the workspace.
 * @throws {ApiError} When the workspace is not found or is in the recycle bin.
 * When any of the users documents are not found.
 */
export default async function addUsersToWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  if (workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspaceId} is in the recycle bin.`);
  const userIdsToAdd = userIds.filter((uid) => !workspace.userIds.includes(uid));
  const batch = adminDb.batch();
  if (userIdsToAdd.length > 0) {
    for (const userId of userIdsToAdd) {
      batch.update(testCollections.users.doc(userId), {
        workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceId),
        workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
      });
    }
    batch.update(testCollections.workspaces.doc(workspaceId), {
      userIds: adminArrayUnion<Workspace, "userIds">(...userIdsToAdd),
      invitedUserIds: adminArrayRemove<Workspace, "invitedUserIds">(...userIdsToAdd),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(testCollections.workspaceSummaries.doc(workspaceId), {
      userIds: adminArrayUnion<WorkspaceSummary, "userIds">(...userIdsToAdd),
      invitedUserIds: adminArrayRemove<WorkspaceSummary, "invitedUserIds">(...userIdsToAdd),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  }
  await batch.commit();
}
