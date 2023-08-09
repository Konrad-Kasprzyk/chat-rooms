import { AdminCollections, adminDb } from "db/admin/firebase-admin";

export default async function deleteTestCollections(testsId: string): Promise<void> {
  const testCollectionsRef = AdminCollections.testCollections.where("testsId", "==", testsId);
  const testCollectionsSnap = await testCollectionsRef.get();
  const promises: Promise<any>[] = [];
  for (const testCollection of testCollectionsSnap.docs) {
    promises.push(adminDb.recursiveDelete(testCollection.ref));
  }
  await Promise.all(promises);
}
