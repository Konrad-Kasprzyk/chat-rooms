import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import ApiError from "common/types/apiError.class";

/**
 * Removes provided users from the workspace. Users invited to the workspace will still be invited.
 */
export default async function removeUsersFromWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  const userIdsToRemove = userIds.filter((uid) => workspace.userIds.includes(uid));
  const batch = adminDb.batch();
  if (userIdsToRemove.length > 0) {
    for (const userId of userIdsToRemove) {
      batch.update(testCollections.users.doc(userId), {
        workspaceIds: adminArrayRemove<User, "workspaceIds">(workspaceId),
      });
    }
    batch.update(testCollections.workspaces.doc(workspaceId), {
      userIds: adminArrayRemove<Workspace, "userIds">(...userIdsToRemove),
    });
  }
  await batch.commit();
}
