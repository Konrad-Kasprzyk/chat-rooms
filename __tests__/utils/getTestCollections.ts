import COLLECTIONS, {
  collectionsType,
  VALID_COLLECTIONS,
} from "../../global/constants/collections";

export default function getTestCollections(uniquePrefix: string): collectionsType {
  const testCollections: { [key in typeof VALID_COLLECTIONS[number]]: string } = Object.assign(
    {},
    COLLECTIONS
  );
  for (const collectionName of VALID_COLLECTIONS) {
    testCollections[collectionName] = uniquePrefix + "/uid/" + testCollections[collectionName];
  }
  return testCollections;
}
