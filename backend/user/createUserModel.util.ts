import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import GLOBAL_COUNTER_ID from "common/constants/globalCounterId.constant";
import User from "common/models/user.model";
import ApiError from "common/types/apiError.class";
import getNextShortId from "common/utils/counterIdsGenerator.util";
import { AdminCollections, adminDb } from "db/admin/firebase-admin";

/**
 * @throws {string} When the provided uid or email is empty.
 * @returns A promise that resolves to the created user document. Promise throws
 * MessageWithCode when the global counter does not exist or the user document with provided
 * uid already exists.
 */
export default async function createUserModel(
  uid: string,
  username: string,
  email: string,
  collections: typeof AdminCollections = AdminCollections
): Promise<User> {
  if (!uid) throw new ApiError(400, "Uid is not a non-empty string.");
  if (!email) throw new ApiError(400, "Email is not a non-empty string.");
  return adminDb.runTransaction(async (transaction) => {
    const globalCounterRef = collections.globalCounter.doc(GLOBAL_COUNTER_ID);
    const globalCounter = (await transaction.get(globalCounterRef)).data();
    if (!globalCounter)
      throw new ApiError(500, "Couldn't find global counter to generate the user short id.");
    const userRef = collections.users.doc(uid);
    const userModel: User = {
      ...USER_INIT_VALUES,
      ...{
        id: uid,
        shortId: globalCounter.nextUserShortId,
        email,
        username,
      },
    };
    transaction.create(userRef, userModel);
    transaction.update(globalCounterRef, {
      nextUserShortId: getNextShortId(globalCounter.nextUserShortId),
    });
    return userModel;
  });
}
