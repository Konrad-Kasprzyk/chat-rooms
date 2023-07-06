import COLLECTIONS from "common/constants/collections";
import TestCollections from "common/models/utils_models/testCollections.model";
import { adminDb } from "db/firebase-admin";

export default async function deleteTestCollections(testsId: string) {
  const testCollectionsRef = adminDb
    .collection(COLLECTIONS.testCollections)
    .where(
      "testsId" satisfies keyof TestCollections,
      "==",
      testsId satisfies TestCollections["testsId"]
    );
  const testCollectionsSnap = await testCollectionsRef.get();
  const promises: Promise<any>[] = [];
  for (const testCollection of testCollectionsSnap.docs) {
    promises.push(adminDb.recursiveDelete(testCollection.ref));
  }
  return Promise.all(promises);
}
