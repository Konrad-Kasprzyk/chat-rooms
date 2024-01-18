import { deleteDB } from "idb";

/**
 * Deletes the IndexedDB database regardless of whether the connection is active or not.
 */
export default async function deleteIDB(): Promise<void> {
  await deleteDB("normkeeperIDB");
}
