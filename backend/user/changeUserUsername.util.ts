import adminCollections from "backend/db/adminCollections.firebase";
import ApiError from "common/types/apiError.class";

/**
 * Changes user username.
 * @throws {ApiError} When the provided uid is empty or the user document is not found.
 */
export default async function changeUserUsername(
  uid: string,
  newUsername: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  if (!uid) throw new ApiError(400, "Uid is not a non-empty string.");
  await collections.users.doc(uid).update({ username: newUsername });
}
