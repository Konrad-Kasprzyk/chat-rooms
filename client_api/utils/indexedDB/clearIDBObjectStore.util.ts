import { modelDocs } from "common/types/modelTypes.types";

export default async function clearIDBObjectStore<K extends keyof modelDocs>(modelName: K) {}
