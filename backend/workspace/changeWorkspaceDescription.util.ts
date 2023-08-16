import adminCollections from "db/admin/adminCollections.firebase";
import _changeWorkspaceTitleOrDescription from "./_changeWorkspaceTitleOrDescription.util";

export default async function changeWorkspaceDescription(
  uid: string,
  workspaceId: string,
  newDescription: string,
  testCollections?: typeof adminCollections
) {
  await _changeWorkspaceTitleOrDescription(
    uid,
    workspaceId,
    newDescription,
    "description",
    testCollections
  );
}
