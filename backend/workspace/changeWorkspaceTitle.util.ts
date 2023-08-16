import adminCollections from "db/admin/adminCollections.firebase";
import _changeWorkspaceTitleOrDescription from "./_changeWorkspaceTitleOrDescription.util";

export default async function changeWorkspaceTitle(
  uid: string,
  workspaceId: string,
  newTitle: string,
  testCollections?: typeof adminCollections
) {
  await _changeWorkspaceTitleOrDescription(uid, workspaceId, newTitle, "title", testCollections);
}
