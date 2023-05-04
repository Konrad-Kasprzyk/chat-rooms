import { adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../../global/constants/collections";
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
} from "../../global/constants/workspaceInitValues";
import User from "../../global/models/user.model";
import WorkspaceUrl from "../../global/models/utils_models/workspaceUrl.model";
import Workspace from "../../global/models/workspace.model";
import WorkspaceCounter from "../../global/models/workspaceCounter.model";

export default async function testEmptyWorkspace(
  creatorId: string,
  workspaceId: string,
  workspaceUrl: string,
  workspaceTitle: string,
  workspaceDescription: string
) {
  expect(workspaceId).toBeString();
  expect(workspaceId.length).toBeGreaterThan(0);
  const workspacesSnap = await adminDb
    .collection(COLLECTIONS.workspaces)
    .where("url", "==", workspaceUrl)
    .get();
  expect(workspacesSnap.size).toEqual(1);
  const userSnap = await adminDb.collection(COLLECTIONS.users).doc(creatorId).get();
  expect(userSnap.exists).toBeTrue();
  const user = userSnap.data() as User;
  expect(
    user.workspaces.some(
      (workspace) =>
        workspace.id === workspaceId &&
        workspace.title === workspaceTitle &&
        workspace.description === workspaceDescription
    )
  ).toBeTrue();
  const workspaceSnap = await adminDb.collection(COLLECTIONS.workspaces).doc(workspaceId).get();
  expect(workspaceSnap.exists).toBeTrue();
  const workspace = workspaceSnap.data() as Workspace;
  expect(workspace.id).toEqual(workspaceId);
  expect(workspace.url).toEqual(workspaceUrl);
  expect(workspace.title).toEqual(workspaceTitle);
  expect(workspace.description).toEqual(workspaceDescription);
  expect(workspace.counterId).toBeString();
  expect(workspace.userIds).toEqual([creatorId]);
  expect(workspace.invitedUserIds).toBeArrayOfSize(0);
  expect(workspace.columns).toEqual(INIT_TASK_COLUMNS);
  expect(workspace.labels).toEqual(INIT_TASK_LABELS);
  expect(workspace.hasItemsInBin).toBeFalse();
  expect(workspace.historyId).toBeEmpty();
  expect(workspace.placingInBinTime).toBeNull();
  expect(workspace.inRecycleBin).toBeFalse();
  expect(workspace.insertedIntoBinByUserId).toBeNull();
  const workspaceUrlSnap = await adminDb
    .collection(COLLECTIONS.workspaceUrls)
    .doc(workspaceUrl)
    .get();
  expect(workspaceUrlSnap.exists).toBeTrue();
  const workspaceUrlDoc = workspaceUrlSnap.data() as WorkspaceUrl;
  expect(workspaceUrlDoc.id).toEqual(workspace.url);
  const workspaceCounterSnap = await adminDb
    .collection(COLLECTIONS.counters)
    .doc(workspace.counterId)
    .get();
  expect(workspaceCounterSnap.exists).toBeTrue();
  const workspaceCounter = workspaceCounterSnap.data() as WorkspaceCounter;
  expect(workspaceCounter.workspaceId).toEqual(workspaceId);
  expect(workspaceCounter.nextTaskShortId).toEqual(INIT_COUNTER_TASK_SHORT_ID);
  expect(workspaceCounter.nextTaskSearchId).toEqual(INIT_COUNTER_TASK_SEARCH_ID);
  expect(workspaceCounter.nextLabelId).toEqual(INIT_COUNTER_LABEL_ID);
  expect(workspaceCounter.nextColumnId).toEqual(INIT_COUNTER_COLUMN_ID);
  expect(workspaceCounter.nextGoalShortId).toEqual(INIT_COUNTER_GOAL_SHORT_ID);
  expect(workspaceCounter.nextGoalSearchId).toEqual(INIT_COUNTER_GOAL_SEARCH_ID);
  expect(workspaceCounter.nextNormSearchId).toEqual(INIT_COUNTER_NORM_SEARCH_ID);
}
