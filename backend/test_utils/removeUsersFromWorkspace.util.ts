import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Removes provided users from the workspace. Users invited to the workspace will remain invited.
 * @throws {ApiError} When the workspace is not found or is in the recycle bin.
 * When any of the users documents are not found.
 */
export default async function removeUsersFromWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  if (workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspaceId} is in the recycle bin.`);
  let userIdsToRemove = userIds.filter((uid) => workspace.userIds.includes(uid));
  userIdsToRemove = userIdsToRemove.filter((uid) => !workspace.invitedUserIds.includes(uid));
  const batch = adminDb.batch();
  if (userIdsToRemove.length > 0) {
    for (const userId of userIdsToRemove) {
      batch.update(testCollections.users.doc(userId), {
        workspaceIds: adminArrayRemove<User, "workspaceIds">(workspaceId),
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
      });
    }
    batch.update(testCollections.workspaces.doc(workspaceId), {
      userIds: adminArrayRemove<Workspace, "userIds">(...userIdsToRemove),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    batch.update(testCollections.workspaceSummaries.doc(workspaceId), {
      userIds: adminArrayRemove<WorkspaceSummary, "userIds">(...userIdsToRemove),
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
  }
  await batch.commit();
}
