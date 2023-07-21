import COLLECTIONS from "common/constants/collections.constant";
import COLUMNS_INIT_VALUES from "common/constants/docsInitValues/workspace/columnsInitValues.constant";
import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import LABELS_INIT_VALUES from "common/constants/docsInitValues/workspace/labelsInitValues.constant";
import User, { validateUser } from "common/models/user.model";
import WorkspaceUrl, { validateWorkspaceUrl } from "common/models/utils_models/workspaceUrl.model";
import Workspace, { validateWorkspace } from "common/models/workspace_models/workspace.model";
import WorkspaceCounter, {
  validateWorkspaceCounter,
} from "common/models/workspace_models/workspaceCounter.model";
import { auth, db } from "db/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export default async function checkEmptyWorkspace(
  workspaceId: string,
  workspaceUrl: string,
  workspaceTitle: string,
  workspaceDescription: string,
  matchInitValues: boolean = false
) {
  if (!auth.currentUser) throw "User is not signed in.";
  const creatorId = auth.currentUser.uid;
  expect(workspaceId).not.toBeEmpty();
  expect(workspaceUrl).not.toBeEmpty();
  // Check if only one workspace exists with provided url
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
  expect(validateUser(user).success).toBeTrue();
  // check if signed in user belongs to the workspace
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
  expect(validateWorkspace(workspace).success).toBeTrue();

  expect(workspace.id).toEqual(workspaceId);
  expect(workspace.url).toEqual(workspaceUrl);
  expect(workspace.title).toEqual(workspaceTitle);
  expect(workspace.description).toEqual(workspaceDescription);
  expect(workspace.userIds).toContain(creatorId);

  const workspaceUrlSnap = await getDoc(doc(db, COLLECTIONS.workspaceUrls, workspaceUrl));
  expect(workspaceUrlSnap.exists()).toBeTrue();
  const workspaceUrlDoc = workspaceUrlSnap.data() as WorkspaceUrl;
  validateWorkspaceUrl(workspaceUrlDoc);
  expect(workspaceUrlDoc.id).toEqual(workspace.url);

  const workspaceCounterSnap = await getDoc(doc(db, COLLECTIONS.counters, workspace.counterId));
  expect(workspaceCounterSnap.exists()).toBeTrue();
  const workspaceCounter = workspaceCounterSnap.data() as WorkspaceCounter;
  expect(validateWorkspaceCounter(workspaceCounter).success).toBeTrue();

  expect(workspaceCounter.workspaceId).toEqual(workspaceId);

  if (matchInitValues) {
    expect(workspace.userIds).toStrictEqual([creatorId]);

    for (const key of Object.keys(
      EMPTY_WORKSPACE_INIT_VALUES
    ) as (keyof typeof EMPTY_WORKSPACE_INIT_VALUES)[]) {
      expect(workspace[key]).toStrictEqual(EMPTY_WORKSPACE_INIT_VALUES[key]);
    }

    for (const key of Object.keys(COLUMNS_INIT_VALUES) as (keyof typeof COLUMNS_INIT_VALUES)[]) {
      expect(workspace.columns[key]).toStrictEqual(COLUMNS_INIT_VALUES[key]);
    }

    for (const key of Object.keys(LABELS_INIT_VALUES) as (keyof typeof LABELS_INIT_VALUES)[]) {
      expect(workspace.labels[key]).toStrictEqual(LABELS_INIT_VALUES[key]);
    }

    for (const key of Object.keys(
      EMPTY_WORKSPACE_COUNTER_INIT_VALUES
    ) as (keyof typeof EMPTY_WORKSPACE_COUNTER_INIT_VALUES)[]) {
      expect(workspaceCounter[key]).toStrictEqual(EMPTY_WORKSPACE_COUNTER_INIT_VALUES[key]);
    }
  }
}
