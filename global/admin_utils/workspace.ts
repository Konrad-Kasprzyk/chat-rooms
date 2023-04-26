import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import { adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../constants/collections";
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
} from "../constants/workspaceInitValues";
import Task from "../models/task.model";
import Workspace from "../models/workspace.model";

export function getRandomUrl() {
  return uuidv4();
}

/**
 * This function creates a new empty workspace with a unique URL and adds it to the database.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL.
 * @param testing Marks that this workspace is used for tests.
 * This helps find undeleted documents from tests when teardown fails.
 * @returns a Promise that resolves to a string, which is the ID of the newly created workspace.
 */
export async function createEmptyWorkspace(
  uid: string,
  url: string,
  title: string,
  description: string,
  testing: boolean = false
): Promise<string> {
  return adminDb.runTransaction(async (transaction) => {
    const sameUrlQuery = adminDb.collection(COLLECTIONS.workspaces).where("url", "==", url);
    const sameUrlSnap = await transaction.get(sameUrlQuery);
    if (!sameUrlSnap.empty) throw "Workspace with url " + url + " already exists.";
    const workspaceRef = adminDb.collection(COLLECTIONS.workspaces).doc();
    const workspaceId = workspaceRef.id;
    const workspaceCounterRef = adminDb.collection(COLLECTIONS.counters).doc();
    const counterId = workspaceCounterRef.id;
    transaction.create(workspaceRef, {
      id: workspaceId,
      url,
      title,
      description,
      testing,
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
    transaction.create(workspaceCounterRef, {
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
    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    transaction.update(userRef, {
      workspaces: FieldValue.arrayUnion({ id: workspaceId, title, description }),
    });
    return workspaceId;
  });
}

/**
 * This function deletes a workspace and all related documents from Firestore.
 * Including tasks, goals, norms, etc. Function does not modify user documents.
 * A deleted workspace remains in the documents of users who belonged to that workspace.
 * This function does not check if the workspace has been in the bin for the required
 * number of days before deletion. Check this to prevent the user from retrieving
 * the workspace from the bin. This is important when deleting workspace.
 * @param {string} workspaceId - The ID of the workspace to be deleted.
 * @param {number} [maxDocumentDeletesPerBatch=100] - The maximum number of documents to delete per
 * batch. This is used to limit the number of documents deleted in a single batch operation to avoid
 * exceeding Firestore's limits.
 */
export async function deleteWorkspaceAndRelatedDocuments(
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100
) {
  const deletePromises: Promise<any>[] = [];
  let batch: FirebaseFirestore.WriteBatch;
  let lastDoc: FirebaseFirestore.DocumentData | null;
  let documentsLeftToDelete: boolean;
  const workspaceRef = adminDb.collection(COLLECTIONS.workspaces).doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists) throw "Workspace with id " + workspaceId + " not found.";
  const workspace = workspaceSnap.data() as Workspace;
  for (const collection of [
    COLLECTIONS.tasks,
    COLLECTIONS.goals,
    COLLECTIONS.norms,
    COLLECTIONS.completedTaskStats,
  ]) {
    documentsLeftToDelete = true;
    lastDoc = null;
    batch = adminDb.batch();
    while (documentsLeftToDelete) {
      let docsToDeleteRef = adminDb
        .collection(collection)
        .where("workspaceId", "==", workspaceId)
        .orderBy("id")
        .limit(maxDocumentDeletesPerBatch);
      if (lastDoc) docsToDeleteRef.startAfter(lastDoc);
      let docsToDelete = await docsToDeleteRef.get();
      lastDoc = docsToDelete.size > 0 ? docsToDelete.docs[-1] : null;
      for (const docToDelete of docsToDelete.docs)
        batch.delete(adminDb.collection(COLLECTIONS.tasks).doc(docToDelete.id));
      if (docsToDelete.size < maxDocumentDeletesPerBatch) documentsLeftToDelete = false;
    }
    deletePromises.push(batch.commit());
  }
  const counterRef = adminDb.collection(COLLECTIONS.counters).doc(workspace.counterId);
  deletePromises.push(counterRef.delete());
  deletePromises.push(workspaceRef.delete());
  await Promise.all(deletePromises);
}
