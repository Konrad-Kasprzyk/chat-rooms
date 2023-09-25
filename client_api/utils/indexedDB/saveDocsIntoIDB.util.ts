import { cacheableModelFilters } from "common/types/modelTypes.types";

export default async function saveDocsIntoIDB<K extends keyof cacheableModelFilters>(
  workspaceId: string,
  modelName: K,
  docs: cacheableModelFilters[K]["docs"]
): Promise<cacheableModelFilters[K]["docs"]> {
  return null;
}
