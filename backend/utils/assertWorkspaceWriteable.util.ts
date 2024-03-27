import UserDTO from "common/DTOModels/userDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import ApiError from "common/types/apiError.class";

/**
 * Asserts that the provided workspace is not in the recycle bin and has not the deleted flag set.
 * Asserts that the provided user belongs to the workspace.
 * @throws {ApiError} When the workspace is in the recycle bin or has the deleted flag set.
 * When the user doesn't belong to the workspace.
 */
export default function assertWorkspaceWriteable(workspace: WorkspaceDTO, belongingUser: UserDTO) {
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
