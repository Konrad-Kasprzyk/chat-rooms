import COLLECTIONS from "../../global/constants/collections";
import mutableCollections from "../../global/types/mutableCollections";

export default function getTestCollections(uniquePrefix: string): typeof COLLECTIONS {
  const testCollections: mutableCollections = Object.assign({}, COLLECTIONS);

  (Object.keys(testCollections) as (keyof typeof testCollections)[]).forEach((collection) => {
    testCollections[collection] = uniquePrefix + "/uid/" + testCollections[collection];
  });

  return testCollections;
}
