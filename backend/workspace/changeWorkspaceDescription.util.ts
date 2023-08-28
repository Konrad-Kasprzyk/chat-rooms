import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";

export default async function changeWorkspaceDescription(
  uid: string,
  workspaceId: string,
  newDescription: string,
  collections: typeof adminCollections = adminCollections
) {
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Workspace with id ${workspaceId} not found.`);
  if (!workspace.userIds.some((id) => id === uid))
    throw new ApiError(
      400,
      `Signed in user doesn't belong to the workspace with id ${workspaceId}.`
    );
  const batch = adminDb.batch();
  batch.update(workspaceRef, { description: newDescription });
  batch.update(workspaceSummaryRef, { description: newDescription });
  await batch.commit();
}
