import { cacheableModelFilters } from "common/types/modelTypes.types";
import getIDB from "./getIDB.util";

/**
 * Checks if indexedDB has documents for the provided workspace and model.
 * Gets newest document modification time.
 * @returns The date of the last document modification for the provided workspace and model if found
 *  in IndexedDB, null otherwise.
 */
export default async function getLastModificationTime<K extends keyof cacheableModelFilters>(
  workspaceId: string,
  modelName: K
): Promise<Date | null> {
  const idb = await getIDB();
  if (!idb) return null;
}
