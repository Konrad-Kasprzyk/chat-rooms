import adminAuth from "backend/db/adminAuth.firebase";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Marks user and user details documents as deleted and deletes the user account.
 * Deletes the user account even if the user document is not found or
 * has already been marked as deleted.
 */
export default async function markUserDeleted(
  uid: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const user = (await userRef.get()).data();
  if (user && !user.isDeleted) {
    const batch = adminDb.batch();
    batch.update(userRef, {
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
    });
    batch.update(collections.userDetails.doc(uid), {
      isDeleted: true,
    });
    await batch.commit();
  }
  await adminAuth.deleteUser(uid);
}
