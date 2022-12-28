export const validCollections = ["projects"] as const;

export type collectionsType = {
  readonly [key in typeof validCollections[number]]: string;
};

const collections: collectionsType = {
  projects: "projects",
};

export default collections;
