import COLUMNS_INIT_VALUES from "common/constants/docsInitValues/workspace/columnsInitValues.constant";
import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import LABELS_INIT_VALUES from "common/constants/docsInitValues/workspace/labelsInitValues.constant";
import validateWorkspaceUrl from "common/model_validators/utils_models/validateWorkspaceUrl.util";
import validateUser from "common/model_validators/validateUser.util";
import validateWorkspace from "common/model_validators/validateWorkspace.util";
import validateWorkspaceCounter from "common/model_validators/validateWorkspaceCounter.util";
import auth from "db/client/auth.firebase";
import collections from "db/client/collections.firebase";
import { doc, getDoc, getDocs } from "firebase/firestore";

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
  // Check if only one workspace exists with the provided url
  const workspacesSnap = await getDocs(collections.workspaces.where("url", "==", workspaceUrl));
  expect(workspacesSnap.size).toEqual(1);
  const userRef = doc(collections.users, creatorId);
  const user = (await getDoc(userRef)).data()!;
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

  const workspaceRef = doc(collections.workspaces, workspaceId);
  const workspace = (await getDoc(workspaceRef)).data()!;
  expect(validateWorkspace(workspace).success).toBeTrue();
  expect(workspace.id).toEqual(workspaceId);
  expect(workspace.url).toEqual(workspaceUrl);
  expect(workspace.title).toEqual(workspaceTitle);
  expect(workspace.description).toEqual(workspaceDescription);
  expect(workspace.userIds).toContain(creatorId);

  const workspaceUrlRef = doc(collections.workspaceUrls, workspaceUrl);
  const workspaceUrlDoc = (await getDoc(workspaceUrlRef)).data()!;
  expect(validateWorkspaceUrl(workspaceUrlDoc).success).toBeTrue();
  expect(workspaceUrlDoc.id).toEqual(workspace.url);

  const workspaceCounterRef = doc(collections.workspaceCounters, workspace.counterId);
  const workspaceCounter = (await getDoc(workspaceCounterRef)).data()!;
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
