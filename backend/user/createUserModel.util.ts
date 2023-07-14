import COLLECTIONS from "common/constants/collections.constant";
import GLOBAL_COUNTER_ID from "common/constants/globalCounterId.constant";
import GlobalCounter from "common/models/globalCounter.model";
import User from "common/models/user.model";
import ApiError from "common/types/apiError.class";
import Collections from "common/types/collections.type";
import getNextShortId from "common/utils/counterIdsGenerator.util";
import { adminDb } from "db/firebase-admin";

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
  collections: Collections = COLLECTIONS
): Promise<User> {
  if (!uid) throw new ApiError(400, "Uid is not a non-empty string.");
  if (!email) throw new ApiError(400, "Email is not a non-empty string.");
  return adminDb.runTransaction(async (transaction) => {
    const globalCounterRef = adminDb.collection(collections.counters).doc(GLOBAL_COUNTER_ID);
    const globalCounterSnap = await transaction.get(globalCounterRef);
    if (!globalCounterSnap.exists)
      throw new ApiError(500, "Couldn't find global counter to generate the user short id.");
    const globalCounter = globalCounterSnap.data() as GlobalCounter;
    const userRef = adminDb.collection(collections.users).doc(uid);
    const userModel: User = {
      id: uid,
      shortId: globalCounter.nextUserShortId,
      email: email!,
      username,
      workspaces: [],
      workspaceIds: [],
      workspaceInvitations: [],
      workspaceInvitationIds: [],
    };
    transaction.create(userRef, userModel);
    transaction.update(globalCounterRef, {
      nextUserShortId: getNextShortId(
        globalCounter.nextUserShortId
      ) satisfies GlobalCounter["nextUserShortId"],
    });
    return userModel;
  });
}
