import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import validateWorkspaceCounter from "common/model_validators/utils_models/validateWorkspaceCounter.util";
import validateWorkspaceUrl from "common/model_validators/utils_models/validateWorkspaceUrl.util";
import validateUser from "common/model_validators/validateUser.util";
import validateWorkspace from "common/model_validators/validateWorkspace.util";
import validateWorkspaceSummary from "common/model_validators/validateWorkspaceSummary.util";
import { doc, getDoc, getDocs } from "firebase/firestore";
import checkInitValues from "./checkInitValues.util";

/**
 * Asserts that the new workspace was created properly.
 * Also asserts if signed in user belongs to the workspace.
 */
export default async function checkEmptyWorkspace(
  workspaceId: string,
  workspaceUrl: string,
  workspaceTitle: string,
  workspaceDescription: string
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
  validateUser(user);
  expect(user.workspaceIds.some((wId) => wId === workspaceId)).toBeTrue();

  const workspaceRef = doc(collections.workspaces, workspaceId);
  const workspace = (await getDoc(workspaceRef)).data()!;
  validateWorkspace(workspace);
  expect(workspace.userIds).toStrictEqual([creatorId]);
  expect(workspace.id).toEqual(workspaceId);
  expect(workspace.url).toEqual(workspaceUrl);
  expect(workspace.title).toEqual(workspaceTitle);
  expect(workspace.description).toEqual(workspaceDescription);

  const workspaceSummaryRef = doc(collections.workspaceSummaries, workspaceId);
  const workspaceSummary = (await getDoc(workspaceSummaryRef)).data()!;
  validateWorkspaceSummary(workspaceSummary);
  expect(workspaceSummary.id).toEqual(workspaceId);
  expect(workspaceSummary.url).toEqual(workspaceUrl);
  expect(workspaceSummary.title).toEqual(workspaceTitle);
  expect(workspaceSummary.description).toEqual(workspaceDescription);

  const workspaceUrlRef = doc(collections.workspaceUrls, workspaceUrl);
  const workspaceUrlDoc = (await getDoc(workspaceUrlRef)).data()!;
  validateWorkspaceUrl(workspaceUrlDoc);
  expect(workspaceUrlDoc.id).toEqual(workspace.url);

  const workspaceCounterRef = doc(collections.workspaceCounters, workspaceId);
  const workspaceCounter = (await getDoc(workspaceCounterRef)).data()!;
  validateWorkspaceCounter(workspaceCounter);

  checkInitValues(workspace, EMPTY_WORKSPACE_INIT_VALUES);
  checkInitValues(workspaceCounter, EMPTY_WORKSPACE_COUNTER_INIT_VALUES);

  // // Assert that all dates were created at the same time.
  // let dateFromServer: Timestamp | undefined = undefined;
  // for (const key of Object.keys(
  //   EMPTY_WORKSPACE_INIT_VALUES
  // ) as (keyof typeof EMPTY_WORKSPACE_INIT_VALUES)[]) {
  //   if (workspace[key] instanceof Timestamp) {
  //     const dateToCheck = workspace[key] as Timestamp;
  //     expect(dateToCheck).toBeInstanceOf(Timestamp);
  //     if (dateFromServer) expect(dateToCheck.toString()).toStrictEqual(dateFromServer.toString());
  //     else dateFromServer = dateToCheck;
  //   } else expect(workspace[key]).toStrictEqual(EMPTY_WORKSPACE_INIT_VALUES[key]);
  // }

  // for (const key of Object.keys(COLUMNS_INIT_VALUES) as (keyof typeof COLUMNS_INIT_VALUES)[]) {
  //   expect(workspace.columns[key]).toStrictEqual(COLUMNS_INIT_VALUES[key]);
  // }

  // for (const key of Object.keys(LABELS_INIT_VALUES) as (keyof typeof LABELS_INIT_VALUES)[]) {
  //   expect(workspace.labels[key]).toStrictEqual(LABELS_INIT_VALUES[key]);
  // }

  // for (const key of Object.keys(
  //   EMPTY_WORKSPACE_COUNTER_INIT_VALUES
  // ) as (keyof typeof EMPTY_WORKSPACE_COUNTER_INIT_VALUES)[]) {
  //   expect(workspaceCounter[key]).toStrictEqual(EMPTY_WORKSPACE_COUNTER_INIT_VALUES[key]);
  // }
}
