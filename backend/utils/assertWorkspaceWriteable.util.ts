import User from "common/models/user.model";
import Workspace from "common/models/workspaceModels/workspace.model";
import ApiError from "common/types/apiError.class";

/**
 * Asserts that the provided workspace is not in the recycle bin and has not the deleted flag set.
 * Asserts that the provided user belongs to the workspace and has not the deleted flag set.
 * @throws {ApiError} When the workspace is in the recycle bin or has the deleted flag set.
 * When the user doesn't belong to the workspace or has the deleted flag set.
 */
export default function assertWorkspaceWriteable(workspace: Workspace, belongingUser: User) {
  if (belongingUser.isDeleted)
    throw new ApiError(400, `The user with id ${belongingUser.id} has the deleted flag set.`);
  if (workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspace.id} is in the recycle bin.`);
  if (workspace.isDeleted)
    throw new ApiError(
      500,
      `The workspace with id ${workspace.id} has the deleted flag set, but is not in the recycle bin.`
    );
  if (
    !workspace.userIds.includes(belongingUser.id) ||
    !belongingUser.workspaceIds.includes(workspace.id)
  )
    throw new ApiError(
      400,
      `The user with id ${belongingUser.id} doesn't belong to the workspace with id ${workspace.id}`
    );
}
