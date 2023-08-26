import adminCollections from "backend/db/adminCollections.firebase";
import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import User from "common/models/user.model";
import ApiError from "common/types/apiError.class";

/**
 * @throws {ApiError} When the provided uid or email is empty.
 * @returns A promise that resolves to the created user document. Promise throws
 * MessageWithCode when the global counter does not exist or the user document with provided
 * uid already exists.
 */
export default async function createUserModel(
  uid: string,
  username: string,
  email: string,
  collections: typeof adminCollections = adminCollections
): Promise<User> {
  if (!uid) throw new ApiError(400, "Uid is not a non-empty string.");
  if (!email) throw new ApiError(400, "Email is not a non-empty string.");
  const userRef = collections.users.doc(uid);
  const userModel: User = {
    ...USER_INIT_VALUES,
    ...{
      id: uid,
      email,
      username,
    },
  };
  await userRef.create(userModel);
  return userModel;
}
