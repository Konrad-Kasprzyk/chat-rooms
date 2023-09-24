import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";

export default async function deleteTestCollections(testsId: string): Promise<void> {
  const testCollectionsRef = adminCollections.testCollections.where("testsId", "==", testsId);
  const testCollectionsSnap = await testCollectionsRef.get();
  const promises: Promise<any>[] = [];
  for (const testCollection of testCollectionsSnap.docs) {
    promises.push(adminDb.recursiveDelete(testCollection.ref));
  }
  await Promise.all(promises);
}
