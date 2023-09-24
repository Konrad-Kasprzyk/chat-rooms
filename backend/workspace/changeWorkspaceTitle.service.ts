import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import _assertWorkspaceWriteable from "./_assertWorkspaceWriteable.util";

export default async function changeWorkspaceTitle(
  uid: string,
  workspaceId: string,
  newTitle: string,
  collections: typeof adminCollections = adminCollections
) {
  await _assertWorkspaceWriteable(workspaceId, uid, collections);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
  const batch = adminDb.batch();
  batch.update(workspaceRef, {
    title: newTitle,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  batch.update(workspaceSummaryRef, {
    title: newTitle,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  await batch.commit();
}
