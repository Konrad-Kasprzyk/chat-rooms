import { AdminCollections } from "db/admin/firebase-admin";

//TODO
export async function deleteExpiredItemsFromBin(
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100,
  collections: typeof AdminCollections = AdminCollections
) {}
