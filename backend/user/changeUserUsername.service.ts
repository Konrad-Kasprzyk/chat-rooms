import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import ApiError from "common/types/apiError.class";
import getBotUsername from "common/utils/getBotUsername.util";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Changes user username.
 * @throws {ApiError} When the user document is not found.
 */
export default async function changeUserUsername(
  uid: string,
  newUsername: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  if (!newUsername)
    throw new ApiError(400, "The new username is required to be a non-empty string.");
  const userPromise = collections.users.doc(uid).get();
  const userDetailsPromise = collections.userDetails.doc(uid).get();
  await Promise.all([userPromise, userDetailsPromise]);
  const user = (await userPromise).data();
  if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
  const userDetails = (await userDetailsPromise).data();
  if (!userDetails)
    throw new ApiError(
      500,
      `The user details document with id ${uid} not found, but found the user document.`
    );
  const batch = adminDb.batch();
  batch.update(collections.users.doc(uid), {
    username: newUsername,
    modificationTime: FieldValue.serverTimestamp(),
  });
  const botIds = userDetails.linkedUserDocumentIds.filter((id) => id !== uid);
  botIds.sort();
  for (let i = 0; i < botIds.length; i++) {
    batch.update(collections.users.doc(botIds[i]), {
      username: getBotUsername(newUsername, i),
      modificationTime: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
}
