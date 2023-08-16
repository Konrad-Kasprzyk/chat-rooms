import adminCollections from "db/admin/adminCollections.firebase";
import adminDb from "db/admin/adminDb.firebase";

export default async function deleteTestCollections(testsId: string): Promise<void> {
  const testCollectionsRef = adminCollections.testCollections.where("testsId", "==", testsId);
  const testCollectionsSnap = await testCollectionsRef.get();
  const promises: Promise<any>[] = [];
  for (const testCollection of testCollectionsSnap.docs) {
    promises.push(adminDb.recursiveDelete(testCollection.ref));
  }
  await Promise.all(promises);
}
