import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../constants/collections";
import {
  INIT_COUNTER_COLUMN_ID,
  INIT_COUNTER_GOAL_SEARCH_ID,
  INIT_COUNTER_GOAL_SHORT_ID,
  INIT_COUNTER_LABEL_ID,
  INIT_COUNTER_NORM_SEARCH_ID,
  INIT_COUNTER_TASK_SEARCH_ID,
  INIT_COUNTER_TASK_SHORT_ID,
  INIT_TASK_COLUMNS,
  INIT_TASK_LABELS,
} from "../../constants/workspaceInitValues";
import Workspace from "../../models/workspace.model";

/**
 * This function creates a new empty workspace with a unique URL and adds it to the database.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL.
 * @param testing Marks that this workspace is used for tests.
 * This helps find undeleted documents from tests when teardown fails.
 * @returns a Promise that resolves to a string, which is the ID of the newly created workspace.
 * @throws When the workspace with provided url already exists or user document is not found.
 */
export async function createEmptyWorkspace(
  uid: string,
  url: string,
  title: string,
  description: string,
  collections: typeof COLLECTIONS = COLLECTIONS
): Promise<string> {
  const workspaceUrlRef = adminDb.collection(collections.workspaceUrls).doc(url);
  const workspaceUrlSnap = await workspaceUrlRef.get();
  if (workspaceUrlSnap.exists) throw "Workspace with url " + url + " already exists.";
  const userRef = adminDb.collection(collections.users).doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) throw "User document with id " + uid + " not found.";
  const workspaceRef = adminDb.collection(collections.workspaces).doc();
  const workspaceId = workspaceRef.id;
  const workspaceCounterRef = adminDb.collection(collections.counters).doc();
  const counterId = workspaceCounterRef.id;
  const batch = adminDb.batch();
  batch.create(workspaceRef, {
    id: workspaceId,
    url,
    title,
    description,
    counterId,
    userIds: [uid],
    invitedUserIds: [],
    columns: INIT_TASK_COLUMNS,
    labels: INIT_TASK_LABELS,
    hasItemsInBin: false,
    historyId: "",
    placingInBinTime: null,
    inRecycleBin: false,
    insertedIntoBinByUserId: null,
  });
  batch.create(workspaceUrlRef, {
    id: url,
  });
  batch.create(workspaceCounterRef, {
    id: counterId,
    workspaceId: workspaceId,
    nextTaskShortId: INIT_COUNTER_TASK_SHORT_ID,
    nextTaskSearchId: INIT_COUNTER_TASK_SEARCH_ID,
    nextLabelId: INIT_COUNTER_LABEL_ID,
    nextColumnId: INIT_COUNTER_COLUMN_ID,
    nextGoalShortId: INIT_COUNTER_GOAL_SHORT_ID,
    nextGoalSearchId: INIT_COUNTER_GOAL_SEARCH_ID,
    nextNormSearchId: INIT_COUNTER_NORM_SEARCH_ID,
  });
  batch.update(userRef, {
    workspaces: FieldValue.arrayUnion({ id: workspaceId, title, description }),
  });
  await batch.commit();
  return workspaceId;
}

/**
 * This function deletes a workspace and all related documents from Firestore.
 * Including tasks, goals, norms, etc. This function removes workspace id from user models.
 * This function does not check if the workspace has been in the bin for the required
 * number of days before deletion. Check this to prevent the user from retrieving
 * the workspace from the bin. This is important when deleting workspace.
 * @param {string} workspaceId - The ID of the workspace to be deleted.
 * @param {number} [maxDocumentDeletesPerBatch=100] - The maximum number of documents to delete per
 * batch. This is used to limit the number of documents deleted in a single batch operation to avoid
 * exceeding Firestore's limits.
 * @throws {string} When found multiple workspaces with provided url
 */
export async function deleteWorkspaceAndRelatedDocuments(
  uid: string,
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100,
  collections: typeof COLLECTIONS = COLLECTIONS
): Promise<any[]> {
  const promises: Promise<any>[] = [];
  let batch: FirebaseFirestore.WriteBatch;
  let lastDoc: FirebaseFirestore.DocumentData | null;
  let documentsLeftToDelete: boolean;
  const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists) throw "Workspace to delete with id " + workspaceId + " not found.";
  const workspace = workspaceSnap.data() as Workspace;
  if (!workspace.userIds.some((id) => id === uid))
    throw "User with id " + uid + " does not belong to workspace with id " + workspaceId;
  // Delete workspace id from user models
  for (const userId of workspace.invitedUserIds) {
    const userRef = adminDb.collection(COLLECTIONS.users).doc(userId);
    promises.push(
      userRef.update({
        workspaceInvitations: FieldValue.arrayRemove({
          id: workspace.id,
          title: workspace.title,
          description: workspace.description,
        }),
      })
    );
  }
  for (const userId of workspace.userIds) {
    const userRef = adminDb.collection(COLLECTIONS.users).doc(userId);
    promises.push(
      userRef.update({
        workspaces: FieldValue.arrayRemove({
          id: workspace.id,
          title: workspace.title,
          description: workspace.description,
        }),
      })
    );
  }
  // Delete workspace and all related documents
  for (const collection of [
    collections.tasks,
    collections.goals,
    collections.norms,
    collections.completedTaskStats,
  ]) {
    documentsLeftToDelete = true;
    lastDoc = null;
    batch = adminDb.batch();
    while (documentsLeftToDelete) {
      let docsToDeleteRef = adminDb
        .collection(collection)
        .where("workspaceId", "==", workspace.id)
        .orderBy("id")
        .limit(maxDocumentDeletesPerBatch);
      if (lastDoc) docsToDeleteRef.startAfter(lastDoc);
      let docsToDelete = await docsToDeleteRef.get();
      lastDoc = docsToDelete.size > 0 ? docsToDelete.docs[-1] : null;
      for (const docToDelete of docsToDelete.docs)
        batch.delete(adminDb.collection(collections.tasks).doc(docToDelete.id));
      if (docsToDelete.size < maxDocumentDeletesPerBatch) documentsLeftToDelete = false;
    }
    promises.push(batch.commit());
  }
  promises.push(adminDb.collection(collections.counters).doc(workspace.counterId).delete());
  promises.push(adminDb.collection(collections.workspaceUrls).doc(workspace.url).delete());
  promises.push(adminDb.collection(collections.workspaces).doc(workspace.id).delete());
  return Promise.all(promises);
}
