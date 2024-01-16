import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import USER_DETAILS_INIT_VALUES from "common/constants/docsInitValues/userDetailsInitValues.constant";
import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import ApiError from "common/types/apiError.class";

/**
 * Creates a user document with a userDetails document.
 * @returns A promise that resolves to the created user document id.
 * @throws {ApiError} When the provided uid or email is empty.
 * When the user document with the provided uid already exists.
 */
export default async function createUserDocument(
  uid: string,
  username: string,
  email: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  if (!uid) throw new ApiError(400, "The user id is required to be a non-empty string.");
  if (!email) throw new ApiError(400, "The email is required to be a non-empty string.");
  const batch = adminDb.batch();
  const userRef = collections.users.doc(uid);
  const userModel: User = {
    ...USER_INIT_VALUES,
    ...{
      id: uid,
      email,
      username,
    },
  };
  batch.create(userRef, userModel);
  const userDetailsRef = collections.userDetails.doc(uid);
  const userDetailsModel: UserDetails = {
    ...USER_DETAILS_INIT_VALUES,
    ...{
      id: uid,
    },
  };
  batch.create(userDetailsRef, userDetailsModel);
  await batch.commit();
  return userRef.id;
}
