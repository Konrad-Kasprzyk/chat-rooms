import { AdminCollections } from "db/admin/firebase-admin";
import _changeWorkspaceTitleOrDescription from "./_changeWorkspaceTitleOrDescription.util";

export default async function changeWorkspaceDescription(
  uid: string,
  workspaceId: string,
  newDescription: string,
  testCollections?: typeof AdminCollections
) {
  await _changeWorkspaceTitleOrDescription(
    uid,
    workspaceId,
    newDescription,
    "description",
    testCollections
  );
}
