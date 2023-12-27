import adminCollections from "backend/db/adminCollections.firebase";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Marks the user deleted.
 * @throws {ApiError} When the user document is not found or has a deleted flag set already.
 */
export default async function markUserDeleted(
  uid: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const user = (await userRef.get()).data();
  if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
  if (user.isDeleted)
    throw new ApiError(400, `The user with id ${uid} has the deleted flag set already.`);
  await userRef.update({
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
    isDeleted: true,
    deletionTime: FieldValue.serverTimestamp() as Timestamp,
  });
}
