import adminCollections from "backend/db/adminCollections.firebase";
import ApiError from "common/types/apiError.class";

export default async function _assertWorkspaceWriteable(
  workspaceId: string,
  belongingUserId: string,
  collections: typeof adminCollections
) {
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  if (workspace.isInBin)
    throw new ApiError(400, `The workspace with id ${workspaceId} is in the recycle bin.`);
  if (!workspace.userIds.some((id) => id === belongingUserId))
    throw new ApiError(
      400,
      `Signed in user doesn't belong to the workspace with id ${workspaceId}.`
    );
}
