import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import _assertWorkspaceWriteable from "./_assertWorkspaceWriteable.util";

export default async function changeWorkspaceDescription(
  uid: string,
  workspaceId: string,
  newDescription: string,
  collections: typeof adminCollections = adminCollections
) {
  await _assertWorkspaceWriteable(workspaceId, uid, collections);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const workspaceSummaryRef = collections.workspaceSummaries.doc(workspaceId);
  const batch = adminDb.batch();
  batch.update(workspaceRef, {
    description: newDescription,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  batch.update(workspaceSummaryRef, {
    description: newDescription,
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  await batch.commit();
}
