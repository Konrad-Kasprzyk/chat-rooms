import { collectionsType } from "../../global/constants/collections";
import { adminDb } from "../../db/firebase-admin";

export default async function deleteCollections(
  collectionsToDelete: collectionsType
): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const collection of Object.values(collectionsToDelete)) {
    promises.push(adminDb.recursiveDelete(adminDb.collection(collection)));
  }
  await Promise.all(promises);
}
