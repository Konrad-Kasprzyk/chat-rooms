import COLLECTIONS from "../../global/constants/collections";
import { adminDb } from "../../db/firebase-admin";

export default async function deleteCollections(
  collectionsToDelete: typeof COLLECTIONS
): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const collection of Object.values(collectionsToDelete)) {
    promises.push(adminDb.recursiveDelete(adminDb.collection(collection)));
  }
  await Promise.all(promises);
}
