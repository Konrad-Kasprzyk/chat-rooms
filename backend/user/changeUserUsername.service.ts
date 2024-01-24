import adminCollections from "backend/db/adminCollections.firebase";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Changes user username.
 * @throws {ApiError} When the user document is not found or has the deleted flag set.
 */
export default async function changeUserUsername(
  uid: string,
  newUsername: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const user = (await collections.users.doc(uid).get()).data();
  if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
  if (user.isDeleted) throw new ApiError(400, `The user with id ${uid} has the deleted flag set.`);
  await collections.users.doc(uid).update({
    username: newUsername,
    modificationTime: FieldValue.serverTimestamp(),
  });
}
