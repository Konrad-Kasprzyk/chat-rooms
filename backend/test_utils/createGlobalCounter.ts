import GLOBAL_COUNTER_ID from "common/constants/globalCounterId";
import Collections from "common/types/collections";
import { adminDb } from "db/firebase-admin";

export default function createGlobalCounter(testCollections: Collections) {
  return adminDb
    .collection(testCollections.counters)
    .doc(GLOBAL_COUNTER_ID)
    .create({ nextUserShortId: String.fromCharCode(32) });
}
