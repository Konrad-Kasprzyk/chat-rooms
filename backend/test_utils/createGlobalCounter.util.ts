import GLOBAL_COUNTER_INIT_VALUES from "common/constants/docsInitValues/globalCounterInitValues.constant";
import GLOBAL_COUNTER_ID from "common/constants/globalCounterId.constant";
import Collections from "common/types/collections.type";
import { adminDb } from "db/firebase-admin";

export default function createGlobalCounter(testCollections: Collections) {
  return adminDb
    .collection(testCollections.counters)
    .doc(GLOBAL_COUNTER_ID)
    .create(GLOBAL_COUNTER_INIT_VALUES);
}
