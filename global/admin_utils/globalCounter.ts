import { adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../constants/collections";
import GLOBAL_COUNTER_ID from "../constants/globalCounterId";

export async function createGlobalCounter() {
  await adminDb
    .collection(COLLECTIONS.counters)
    .doc(GLOBAL_COUNTER_ID)
    .create({ nextUserShortId: " " });
}

export async function deleteGlobalCounter() {
  await adminDb.collection(COLLECTIONS.counters).doc(GLOBAL_COUNTER_ID).delete();
}
