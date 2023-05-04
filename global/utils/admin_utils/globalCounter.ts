import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../constants/collections";
import GLOBAL_COUNTER_ID from "../../constants/globalCounterId";

/**
 * This function creates a global counter in a Firestore database.
 */
export async function createGlobalCounter(collections: typeof COLLECTIONS = COLLECTIONS) {
  await adminDb
    .collection(collections.counters)
    .doc(GLOBAL_COUNTER_ID)
    .create({ nextUserShortId: " " });
}

/**
 * This function deletes a global counter document from a Firestore database.
 */
export async function deleteGlobalCounter(collections: typeof COLLECTIONS = COLLECTIONS) {
  await adminDb.collection(collections.counters).doc(GLOBAL_COUNTER_ID).delete();
}
