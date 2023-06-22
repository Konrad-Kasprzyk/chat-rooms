import type Collections from "global/types/collections";
import type MutableCollections from "global/types/mutableCollections";

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
