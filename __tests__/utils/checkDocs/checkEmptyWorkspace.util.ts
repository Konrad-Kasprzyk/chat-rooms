import COLLECTIONS from "common/constants/collections.constant";
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
} from "common/constants/workspaceInitValues.constants";
import User from "common/models/user.model";
import WorkspaceUrl from "common/models/utils_models/workspaceUrl.model";
import Workspace from "common/models/workspace.model";
import WorkspaceCounter from "common/models/workspaceCounter.model";
import { auth, db } from "db/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export default async function checkEmptyWorkspace(
  workspaceId: string,
  workspaceUrl: string,
  workspaceTitle: string,
  workspaceDescription: string
) {
  if (!auth.currentUser) throw "User is not signed in.";
  const creatorId = auth.currentUser.uid;
  expect(workspaceId).toBeString();
  expect(workspaceId.length).toBeGreaterThan(0);
  const workspacesSnap = await getDocs(
    query(
      collection(db, COLLECTIONS.workspaces),
      where("url" satisfies keyof Workspace, "==", workspaceUrl satisfies Workspace["url"])
    )
  );
  expect(workspacesSnap.size).toEqual(1);
  const userSnap = await getDoc(doc(db, COLLECTIONS.users, creatorId));
  expect(userSnap.exists()).toBeTrue();
  const user = userSnap.data() as User;
  expect(
    user.workspaces.some(
      (workspace) =>
        workspace.id === workspaceId &&
        workspace.url === workspaceUrl &&
        workspace.title === workspaceTitle &&
        workspace.description === workspaceDescription
    )
  ).toBeTrue();
  const workspaceSnap = await getDoc(doc(db, COLLECTIONS.workspaces, workspaceId));
  expect(workspaceSnap.exists()).toBeTrue();
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
  const workspaceUrlSnap = await getDoc(doc(db, COLLECTIONS.workspaceUrls, workspaceUrl));
  expect(workspaceUrlSnap.exists()).toBeTrue();
  const workspaceUrlDoc = workspaceUrlSnap.data() as WorkspaceUrl;
  expect(workspaceUrlDoc.id).toEqual(workspace.url);
  const workspaceCounterSnap = await getDoc(doc(db, COLLECTIONS.counters, workspace.counterId));
  expect(workspaceCounterSnap.exists()).toBeTrue();
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
