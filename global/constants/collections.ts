export const VALID_COLLECTIONS = [
  "projects",
  "users",
  "tasks",
  "goals",
  "norms",
  "counters",
] as const;

export type collectionsType = {
  readonly [key in typeof VALID_COLLECTIONS[number]]: string;
};

const COLLECTIONS: collectionsType = {
  projects: "projects",
  users: "users",
  tasks: "tasks",
  goals: "goals",
  norms: "norms",
  counters: "counters",
};

export const PROJECTS_COUNTER_DOCUMENT_NAME = "projects";

export default COLLECTIONS;
