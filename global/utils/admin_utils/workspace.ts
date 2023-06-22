import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import COLLECTIONS from "global/constants/collections";
import { PROJECT_DAYS_IN_BIN } from "global/constants/timeToRetrieveFromBin";
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
} from "global/constants/workspaceInitValues";
import Workspace from "global/models/workspace.model";
import batchDeleteItems from "./batchDeleteItems";

/**
 * This function creates a new empty workspace with a unique URL and adds it to the database.
 * @param uid Id of the user who creates the workspace.
 * @param url Workspace unique URL.
 * @param testing Marks that this workspace is used for tests.
 * This helps find undeleted documents from tests when teardown fails.
 * @returns a Promise that resolves to the newly created workspace.
 * @throws When the workspace with provided url already exists or user document is not found.
 */
export async function createEmptyWorkspace(
  uid: string,
  url: string,
  title: string,
  description: string,
  collections: typeof COLLECTIONS = COLLECTIONS
): Promise<Workspace> {
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
  const workspaceModel: Workspace = {
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
  };
  batch.create(workspaceRef, workspaceModel);
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
    workspaceIds: FieldValue.arrayUnion(workspaceId),
  });
  await batch.commit();
  return workspaceModel;
}

/**
 * This function deletes a workspace and all related documents from Firestore.
 * Including tasks, goals, norms, etc. This function removes workspace id from user models.
 * @param {string} workspaceId - The ID of the workspace to be deleted.
 * @param {number} [maxDocumentDeletesPerBatch=100] - The maximum number of documents to delete per
 * batch. This is used to limit the number of documents deleted in a single batch operation to avoid
 * exceeding Firestore's limits.
 * @throws {string} When a workspace with the provided workspace ID is not found.
 * When the workspace has belonging users or invited users and hasn't been long enough in recycle bin.
 */
export async function deleteWorkspaceAndRelatedDocuments(
  workspaceId: string,
  maxDocumentDeletesPerBatch: number = 100,
  collections: typeof COLLECTIONS = COLLECTIONS
): Promise<any[]> {
  const promises: Promise<any>[] = [];
  const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists) throw "Workspace to delete with id " + workspaceId + " not found.";
  const workspace = workspaceSnap.data() as Workspace;

  // Check if workspace can be deleted
  if (workspace.userIds.length > 0 || workspace.invitedUserIds.length > 0) {
    if (!workspace.inRecycleBin)
      throw "Workspace with id " + workspaceId + " is not in recycle bin.";
    if (!workspace.placingInBinTime)
      throw (
        "Workspace with id " +
        workspaceId +
        " is in recycle bin, but does not have placing in bin time."
      );
    const placingInBinTime = workspace.placingInBinTime.toDate();
    const deletionTime = new Date();
    deletionTime.setDate(placingInBinTime.getDate() + PROJECT_DAYS_IN_BIN);
    if (new Date() < deletionTime)
      throw "Workspace with id " + workspaceId + " is not long enough in recycle bin.";
  }

  // Delete workspace from user models
  for (const userId of workspace.invitedUserIds) {
    const userRef = adminDb.collection(COLLECTIONS.users).doc(userId);
    promises.push(
      userRef.update({
        workspaceInvitations: FieldValue.arrayRemove({
          id: workspace.id,
          title: workspace.title,
          description: workspace.description,
        }),
        workspaceInvitationIds: FieldValue.arrayRemove(workspace.id),
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
        workspaceIds: FieldValue.arrayRemove(workspace.id),
      })
    );
  }

  // Delete workspace and all related documents
  const docsToDelete = [];
  for (const collection of [
    collections.tasks,
    collections.goals,
    collections.norms,
    collections.completedTaskStats,
  ]) {
    const docsToDeleteRef = adminDb.collection(collection).where("workspaceId", "==", workspace.id);
    const docsToDeleteSnap = await docsToDeleteRef.get();
    for (const docSnap of docsToDeleteSnap.docs) docsToDelete.push(docSnap.ref);
  }
  promises.push(batchDeleteItems(docsToDelete, maxDocumentDeletesPerBatch));
  promises.push(adminDb.collection(collections.counters).doc(workspace.counterId).delete());
  promises.push(adminDb.collection(collections.workspaceUrls).doc(workspace.url).delete());
  promises.push(adminDb.collection(collections.workspaces).doc(workspace.id).delete());
  return Promise.all(promises);
}
