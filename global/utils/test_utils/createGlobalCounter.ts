import { adminDb } from "db/firebase-admin";
import COLLECTIONS from "global/constants/collections";
import GLOBAL_COUNTER_ID from "global/constants/globalCounterId";

export default async function createGlobalCounter() {
  return adminDb
    .collection(COLLECTIONS.counters)
    .doc(GLOBAL_COUNTER_ID)
    .create({ nextUserShortId: " " });
}
