import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import { DAYS_TO_DELETE_DOC } from "common/constants/timeToDeleteDoc.constant";
import ApiError from "common/types/apiError.class";

/**
 * Deletes actual user documents and linked bots documents
 * @throws {ApiError} When the user details document is not found or
 * does not have the deleted flag set.
 */
export default async function deleteUser(
  userId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userPromise = collections.users.doc(userId).get();
  const userDetailsPromise = collections.userDetails.doc(userId).get();
  await Promise.all([userPromise, userDetailsPromise]);
  const userDetails = (await userDetailsPromise).data();
  if (!userDetails)
    throw new ApiError(400, `The user details document with id ${userId} not found.`);
  const user = (await userPromise).data();
  if (!user) throw new ApiError(400, `The user document with id ${userId} not found.`);
  if (!user.isDeleted)
    throw new ApiError(400, `The user with id ${userId} does not have the deleted flag set.`);
  if (!user.deletionTime)
    throw new ApiError(
      500,
      `The user with id ${userId} is marked as deleted, but does not have the deletion time.`
    );
  const deletionTime = user.deletionTime.toDate();
  const permanentDeletionTime = new Date(
    deletionTime.getTime() + DAYS_TO_DELETE_DOC * 24 * 60 * 60 * 1000
  );
  if (permanentDeletionTime > new Date())
    throw new ApiError(400, `The user with id ${userId} is not marked as deleted long enough.`);
  const batch = adminDb.batch();
  for (const docToDeleteId of userDetails.linkedUserDocumentIds) {
    batch.delete(collections.users.doc(docToDeleteId));
    batch.delete(collections.userDetails.doc(docToDeleteId));
  }
  await batch.commit();
}
