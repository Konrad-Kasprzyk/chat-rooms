import GLOBAL_COUNTER_INIT_VALUES from "common/constants/docsInitValues/globalCounterInitValues.constant";
import GLOBAL_COUNTER_ID from "common/constants/globalCounterId.constant";
import GlobalCounter from "common/models/globalCounter.model";
import adminCollections from "db/admin/adminCollections.firebase";

export default async function createGlobalCounter(
  testCollections: typeof adminCollections
): Promise<void> {
  const globalCounter: GlobalCounter = { ...GLOBAL_COUNTER_INIT_VALUES, id: GLOBAL_COUNTER_ID };
  await testCollections.globalCounter.doc(GLOBAL_COUNTER_ID).create(globalCounter);
}
