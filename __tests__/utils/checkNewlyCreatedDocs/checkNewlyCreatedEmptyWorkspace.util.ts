import adminCollections from "backend/db/adminCollections.firebase";
import { getSignedInUserId } from "client_api/user/signedInUserId.utils";
import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import WORKSPACE_SUMMARY_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceSummaryInitValues.constant";
import validateUser from "common/model_validators/validateUser.util";
import validateUserDetails from "common/model_validators/validateUserDetails.util";
import validateWorkspace from "common/model_validators/validateWorkspace.util";
import validateWorkspaceCounter from "common/model_validators/validateWorkspaceCounter.util";
import validateWorkspaceSummary from "common/model_validators/validateWorkspaceSummary.util";
import checkInitValues from "./checkInitValues.util";

/**
 * Ensures that the empty workspace, workspace summary and workspace counter documents have been created
 * correctly for the signed in user.
 * @throws {Error} If the current user is not signed in or did not create the workspace.
 * If any of the documents to check the initial values are not found.
 */
export default async function checkNewlyCreatedEmptyWorkspace(
  workspaceId: string,
  workspaceUrl?: string,
  workspaceTitle?: string,
  workspaceDescription?: string
) {
  const workspaceCreatorId = getSignedInUserId();
  if (!workspaceCreatorId) throw new Error("Could not get the current user id.");
  const user = (await adminCollections.users.doc(workspaceCreatorId).get()).data();
  if (!user) throw new Error("Document of the user who created the workspace document not found.");
  validateUser(user);
  expect(user.workspaceIds).toContain(workspaceId);
  const userDetails = (await adminCollections.userDetails.doc(workspaceCreatorId).get()).data();
  if (!userDetails)
    throw new Error(
      "User details document of the user who created the workspace document not found."
    );
  validateUserDetails(userDetails);
  expect(userDetails.hiddenWorkspaceInvitationsIds).not.toContain(workspaceId);

  const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data();
  if (!workspace) throw new Error("Workspace document to check the initial values not found.");
  validateWorkspace(workspace);
  checkInitValues(workspace, EMPTY_WORKSPACE_INIT_VALUES);
  expect(workspace.userIds).toEqual([workspaceCreatorId]);
  expect(workspace.id).toEqual(workspaceId);
  expect(workspace.modificationTime.toDate() <= new Date()).toBeTrue();
  if (workspaceUrl) expect(workspace.url).toEqual(workspaceUrl);
  if (workspaceTitle) expect(workspace.title).toEqual(workspaceTitle);
  if (workspaceDescription) expect(workspace.description).toEqual(workspaceDescription);
  // Check if only one workspace exists with the provided url
  const workspacesSnap = await adminCollections.workspaces.where("url", "==", workspace.url).get();
  expect(workspacesSnap.size).toEqual(1);

  const workspaceSummary = (
    await adminCollections.workspaceSummaries.doc(workspaceId).get()
  ).data();
  if (!workspaceSummary)
    throw new Error("Workspace summary document to check the initial values not found.");
  validateWorkspaceSummary(workspaceSummary);
  checkInitValues(workspaceSummary, WORKSPACE_SUMMARY_INIT_VALUES);
  expect(workspaceSummary.id).toEqual(workspaceId);
  expect(workspaceSummary.modificationTime.toDate().getTime()).toEqual(
    workspace.modificationTime.toDate().getTime()
  );
  if (workspaceUrl) expect(workspaceSummary.url).toEqual(workspaceUrl);
  if (workspaceTitle) expect(workspaceSummary.title).toEqual(workspaceTitle);
  if (workspaceDescription) expect(workspaceSummary.description).toEqual(workspaceDescription);

  const workspaceCounter = (await adminCollections.workspaceCounters.doc(workspaceId).get()).data();
  if (!workspaceCounter)
    throw new Error("Workspace counter document to check the initial values not found.");
  validateWorkspaceCounter(workspaceCounter);
  checkInitValues(workspaceCounter, EMPTY_WORKSPACE_COUNTER_INIT_VALUES);
  expect(workspaceCounter.id).toEqual(workspaceId);
}
