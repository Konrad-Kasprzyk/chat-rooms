import adminCollections from "db/admin/adminCollections.firebase";

//TODO
export async function deleteExpiredItemsFromBin(
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100,
  collections: typeof adminCollections = adminCollections
) {}
