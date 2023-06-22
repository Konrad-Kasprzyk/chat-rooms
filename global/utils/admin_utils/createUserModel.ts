import { adminDb } from "db/firebase-admin";
import COLLECTIONS from "global/constants/collections";
import GLOBAL_COUNTER_ID from "global/constants/globalCounterId";
import GlobalCounter from "global/models/globalCounter.model";
import User from "global/models/user.model";
import MessageWithCode from "global/types/messageWithCode";
import getNextShortId from "../counterIdsGenerator";

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
  testCollections?: typeof COLLECTIONS
): Promise<User> {
  const collections = testCollections ? testCollections : COLLECTIONS;
  if (!uid) throw "Uid is not a non-empty string.";
  if (!email) throw "Email is not a non-empty string.";
  return adminDb.runTransaction(async (transaction) => {
    const globalCounterRef = adminDb.collection(collections.counters).doc(GLOBAL_COUNTER_ID);
    const globalCounterSnap = await transaction.get(globalCounterRef);
    if (!globalCounterSnap.exists)
      throw new MessageWithCode(500, "Couldn't find global counter to generate the user short id.");
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
      nextUserShortId: getNextShortId(globalCounter.nextUserShortId),
    });
    return userModel;
  });
}
