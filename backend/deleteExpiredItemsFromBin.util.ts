import adminCollections from "backend/db/adminCollections.firebase";

//TODO
export async function deleteExpiredItemsFromBin(
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100,
  collections: typeof adminCollections = adminCollections
) {}
