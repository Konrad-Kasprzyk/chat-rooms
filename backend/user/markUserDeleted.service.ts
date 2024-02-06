import adminAuth from "backend/db/adminAuth.firebase";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Marks user and user details documents as deleted and deletes the user account.
 * Marks actual user documents and linked bots documents as deleted.
 * Deletes the user account even if the user document is not found or
 * has already been marked as deleted.
 */
export default async function markUserDeleted(
  uid: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userDetailsRef = collections.userDetails.doc(uid);
  const userDetails = (await userDetailsRef.get()).data();
  if (userDetails && !userDetails.isDeleted) {
    const batch = adminDb.batch();
    for (const docId of userDetails.linkedUserDocumentIds) {
      batch.update(collections.users.doc(docId), {
        modificationTime: FieldValue.serverTimestamp(),
        isDeleted: true,
      });
      batch.update(collections.userDetails.doc(docId), {
        isDeleted: true,
      });
    }
    await batch.commit();
  }
  await adminAuth.deleteUser(uid);
}
