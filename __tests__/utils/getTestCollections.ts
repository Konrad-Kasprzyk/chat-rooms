import collections, { collectionsType, validCollections } from "../../constants/collections";

export default function getTestCollections(uniquePrefix: string): collectionsType {
  const testCollections: { [key in typeof validCollections[number]]: string } = Object.assign(
    {},
    collections
  );
  for (const collectionName of validCollections) {
    testCollections[collectionName] = uniquePrefix + "/uid/" + testCollections[collectionName];
  }
  return testCollections;
}
