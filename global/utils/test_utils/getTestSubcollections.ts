import type Collections from "../../types/collections";
import MutableCollections from "../../types/mutableCollections";

export default function getTestSubcollections(
  COLLECTIONS: Collections,
  testCollectionsId: string
): Collections {
  const testCollections: MutableCollections = Object.assign({}, COLLECTIONS);

  for (const collection of Object.keys(COLLECTIONS) as (keyof Collections)[]) {
    if (collection === "TestUsersAndSubcollections") continue;
    testCollections[
      collection
    ] = `${COLLECTIONS.TestUsersAndSubcollections}/${testCollectionsId}/${COLLECTIONS[collection]}`;
  }
  return testCollections;
}
