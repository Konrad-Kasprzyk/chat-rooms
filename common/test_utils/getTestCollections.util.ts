import type Collections from "common/types/collections.type";
import type MutableCollections from "common/types/mutableCollections.type";

export default function getTestCollections(
  COLLECTIONS: Collections,
  testCollectionsId: string
): Collections {
  const testCollections: MutableCollections = Object.assign({}, COLLECTIONS);

  for (const collection of Object.keys(COLLECTIONS) as (keyof Collections)[]) {
    if (collection === "testCollections") continue;
    testCollections[
      collection
    ] = `${COLLECTIONS.testCollections}/${testCollectionsId}/${COLLECTIONS[collection]}`;
  }
  return testCollections;
}
