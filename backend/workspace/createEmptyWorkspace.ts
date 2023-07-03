import COLLECTIONS from "common/constants/collections";
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
} from "common/constants/workspaceInitValues";
import Workspace from "common/models/workspace.model";
import ApiError from "common/types/apiError";
import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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
  if (workspaceUrlSnap.exists) throw new ApiError(400, `Workspace with url ${url} already exists.`);
  const userRef = adminDb.collection(collections.users).doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) throw new ApiError(400, `User document with id ${uid} not found.`);
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
    workspaces: FieldValue.arrayUnion({ id: workspaceId, url, title, description }),
    workspaceIds: FieldValue.arrayUnion(workspaceId),
  });
  await batch.commit();
  return workspaceModel;
}
