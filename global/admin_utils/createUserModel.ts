import { adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../constants/collections";
import GLOBAL_COUNTER_ID from "../constants/globalCounterId";
import GlobalCounter from "../models/globalCounter.model";
import MessageWithCode from "../types/messageWithCode";
import getNextShortId from "../utils/counterIdsGenerator";

export default async function createUserModel(uid: string, email: string, username: string) {
  if (!uid) throw "Uid missing.";
  if (!email) throw "Email missing.";
  return adminDb.runTransaction(async (transaction) => {
    const globalCounterRef = adminDb.collection(COLLECTIONS.counters).doc(GLOBAL_COUNTER_ID);
    const globalCounterSnap = await transaction.get(globalCounterRef);
    if (!globalCounterSnap.exists)
      throw new MessageWithCode(500, "Couldn't find global counter to generate user short id.");
    const globalCounter = globalCounterSnap.data() as GlobalCounter;
    // Check if user document doesn't exist already
    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    const userSnap = await transaction.get(userRef);
    if (userSnap.exists)
      throw new MessageWithCode(400, "User document with id " + uid + " already exists.");
    transaction.create(userRef, {
      id: uid,
      shortId: globalCounter.nextUserShortId,
      email,
      username,
      workspaces: [],
      workspaceInvitations: [],
    });
    transaction.update(globalCounterRef, {
      nextUserShortId: getNextShortId(globalCounter.nextUserShortId),
    });
    return new MessageWithCode(201, uid);
  });
}

//TODO - delete user from all workspaces and then delete user model
export async function deleteUserModel(uid: string) {}
