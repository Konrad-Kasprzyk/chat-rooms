import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import ApiError from "common/types/apiError.class";
import { AdminCollections, adminDb } from "db/admin/firebase-admin";

/**
 * Takes a user snapshot and a workspace object as
 * input and returns the user object and the user workspace object that needs to be updated.
 * @throws {ApiError} When could not get the user model from the user's snapshot or
 * when the provided workspace could not be found in the user model.
 */
function getUserAndUserWorkspaceToUpdate(
  userSnap: FirebaseFirestore.DocumentSnapshot<User>,
  workspace: Workspace
): [
  User,
  {
    id: string;
    url: string;
    title: string;
    description: string;
  }
] {
  const user = userSnap.data();
  if (!user)
    throw new ApiError(
      500,
      `User with id ${userSnap.id} which belongs to the workspace with ` +
        `id ${workspace.id} and title '${workspace.title}' not found.`
    );
  const userWorkspaceToUpdate = user.workspaces.find((w) => w.id === workspace.id);
  if (!userWorkspaceToUpdate)
    throw new ApiError(
      500,
      `User with id ${user.id} and username ${user.username} that belongs to the workspace with ` +
        `id ${workspace.id} and title '${workspace.title}' doesn't have the workspace saved in the ` +
        `list of workspaces to which they belong.`
    );
  return [user, userWorkspaceToUpdate];
}

export default async function _changeWorkspaceTitleOrDescription(
  uid: string,
  workspaceId: string,
  newTitleOrDescription: string,
  updateTitleOrDescription: "title" | "description",
  collections: typeof AdminCollections = AdminCollections
): Promise<void> {
  const workspaceRef = collections.workspaces.doc(workspaceId);
  await adminDb.runTransaction(async (transaction) => {
    const workspace = (await transaction.get(workspaceRef)).data();
    if (!workspace) throw new ApiError(400, `Workspace with id ${workspaceId} not found.`);
    if (!workspace.userIds.some((id) => id === uid))
      throw new ApiError(400, `Signed in user doesn't belong to workspace with id ${workspaceId}`);
    const belongingUserRefs = workspace.userIds.map((id) => collections.users.doc(id));
    const invitedUserRefs = workspace.invitedUserIds.map((id) => collections.users.doc(id));
    const belongingUsersSnap =
      belongingUserRefs.length > 0 ? await transaction.getAll(...belongingUserRefs) : [];
    const invitedUsersSnap =
      invitedUserRefs.length > 0 ? await transaction.getAll(...invitedUserRefs) : [];
    for (const userSnap of belongingUsersSnap) {
      const [user, userWorkspaceToUpdate] = getUserAndUserWorkspaceToUpdate(userSnap, workspace);
      if (updateTitleOrDescription === "title") userWorkspaceToUpdate.title = newTitleOrDescription;
      else userWorkspaceToUpdate.description = newTitleOrDescription;
      transaction.update(userSnap.ref, {
        workspaces: user.workspaces,
      });
    }
    for (const userSnap of invitedUsersSnap) {
      const [user, userWorkspaceToUpdate] = getUserAndUserWorkspaceToUpdate(userSnap, workspace);
      if (updateTitleOrDescription === "title") userWorkspaceToUpdate.title = newTitleOrDescription;
      else userWorkspaceToUpdate.description = newTitleOrDescription;
      transaction.update(userSnap.ref, {
        workspaceInvitations: user.workspaces,
      });
    }
    transaction.update(
      workspaceRef,
      updateTitleOrDescription === "title"
        ? { title: newTitleOrDescription }
        : { description: newTitleOrDescription }
    );
  });
}
