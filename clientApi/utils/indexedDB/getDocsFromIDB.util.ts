import { cacheableModelFilters } from "common/types/modelTypes.types";

export default async function getDocsFromIDB<K extends keyof cacheableModelFilters>(
  workspaceId: string,
  modelName: K
): Promise<cacheableModelFilters[K]["docs"]> {
  return null;
}
