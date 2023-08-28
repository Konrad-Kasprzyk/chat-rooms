import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import ApiError from "common/types/apiError.class";

/**
 * Adds provided users to the workspace. Users invited to the workspace will also be added.
 */
export default async function addUsersToWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find a workspace with id ${workspaceId}`);
  const userIdsToAdd = userIds.filter((uid) => !workspace.userIds.includes(uid));
  const batch = adminDb.batch();
  if (userIdsToAdd.length > 0) {
    for (const userId of userIdsToAdd) {
      batch.update(testCollections.users.doc(userId), {
        workspaceIds: adminArrayUnion<User, "workspaceIds">(workspaceId),
        workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
      });
    }
    batch.update(testCollections.workspaces.doc(workspaceId), {
      userIds: adminArrayUnion<Workspace, "userIds">(...userIdsToAdd),
      invitedUserIds: adminArrayRemove<Workspace, "invitedUserIds">(...userIdsToAdd),
    });
  }
  await batch.commit();
}
