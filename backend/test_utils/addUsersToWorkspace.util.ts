import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import ApiError from "common/types/apiError.class";
import adminArrayUnion from "db/admin/adminArrayUnion.util";
import { AdminCollections, adminDb } from "db/admin/firebase-admin";

export default async function addUsersToWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: typeof AdminCollections
): Promise<void> {
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find a workspace with id ${workspaceId}`);
  const userIdsToAdd = userIds.filter((uid) => !workspace.userIds.includes(uid));
  const batch = adminDb.batch();
  if (userIdsToAdd.length > 0) {
    for (const userId of userIdsToAdd) {
      batch.update(testCollections.users.doc(userId), {
        workspaces: adminArrayUnion<User, "workspaces">({
          id: workspaceId,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        }),
        workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceId),
      });
    }
    batch.update(testCollections.workspaces.doc(workspaceId), {
      userIds: adminArrayUnion<Workspace, "userIds">(...userIdsToAdd),
    });
  }
  await batch.commit();
}
