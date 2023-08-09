import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import ApiError from "common/types/apiError.class";
import adminArrayRemove from "db/admin/adminArrayRemove.util";
import { AdminCollections, adminDb } from "db/admin/firebase-admin";

export default async function removeUsersFromWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: typeof AdminCollections
): Promise<void> {
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  const userIdsToRemove = userIds.filter((uid) => workspace.userIds.includes(uid));
  const batch = adminDb.batch();
  if (userIdsToRemove.length > 0) {
    for (const userId of userIdsToRemove) {
      batch.update(testCollections.users.doc(userId), {
        workspaces: adminArrayRemove<User, "workspaces">({
          id: workspaceId,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        }),
        workspaceIds: adminArrayRemove<User, "workspaceIds">(workspaceId),
      });
    }
    batch.update(testCollections.workspaces.doc(workspaceId), {
      userIds: adminArrayRemove<Workspace, "userIds">(...userIdsToRemove),
    });
  }
  await batch.commit();
}
