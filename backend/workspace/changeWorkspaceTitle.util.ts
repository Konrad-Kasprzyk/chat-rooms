import { AdminCollections } from "db/admin/firebase-admin";
import _changeWorkspaceTitleOrDescription from "./_changeWorkspaceTitleOrDescription.util";

export default async function changeWorkspaceTitle(
  uid: string,
  workspaceId: string,
  newTitle: string,
  testCollections?: typeof AdminCollections
) {
  await _changeWorkspaceTitleOrDescription(uid, workspaceId, newTitle, "title", testCollections);
}
