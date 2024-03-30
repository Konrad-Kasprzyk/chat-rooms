import adminCollections from "backend/db/adminCollections.firebase";
import { getSignedInUserId } from "client/api/user/signedInUserId.utils";

import validateUserDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateUserDTO.util";
import validateUserDetailsDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateUserDetailsDTO.util";
import validateWorkspaceDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateWorkspaceDTO.util";
import validateWorkspaceSummaryDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateWorkspaceSummaryDTO.util";
import WORKSPACE_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceDTOInitValues.constant";
import WORKSPACE_SUMMARY_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceSummaryDTOInitValues.constant";
import checkInitValues from "./checkInitValues.util";

/**
 * Ensures that the workspace, workspace summary and workspace counter documents have been created
 * correctly for the signed in user.
 * @throws {Error} If the current user is not signed in or did not create the workspace.
 * If any of the documents to check the initial values are not found.
 */
export default async function checkNewlyCreatedWorkspace(
  workspaceId: string,
  workspaceTitle?: string,
  workspaceDescription?: string,
  workspaceUrl?: string
) {
  const workspaceCreatorId = getSignedInUserId();
  if (!workspaceCreatorId) throw new Error("Could not get the current user id.");
  const user = (await adminCollections.users.doc(workspaceCreatorId).get()).data();
  if (!user) throw new Error("Document of the user who created the workspace document not found.");
  validateUserDTO(user);
  expect(user.workspaceIds).toContain(workspaceId);
  const userDetails = (await adminCollections.userDetails.doc(workspaceCreatorId).get()).data();
  if (!userDetails)
    throw new Error(
      "User details document of the user who created the workspace document not found."
    );
  validateUserDetailsDTO(userDetails);
  expect(userDetails.hiddenWorkspaceInvitationIds).not.toContain(workspaceId);

  const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data();
  if (!workspace) throw new Error("Workspace document to check the initial values not found.");
  validateWorkspaceDTO(workspace);
  checkInitValues(workspace, WORKSPACE_DTO_INIT_VALUES);
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
  validateWorkspaceSummaryDTO(workspaceSummary);
  checkInitValues(workspaceSummary, WORKSPACE_SUMMARY_DTO_INIT_VALUES);
  expect(workspaceSummary.id).toEqual(workspaceId);
  expect(workspaceSummary.modificationTime.toDate().getTime()).toEqual(
    workspace.modificationTime.toDate().getTime()
  );
  if (workspaceUrl) expect(workspaceSummary.url).toEqual(workspaceUrl);
  if (workspaceTitle) expect(workspaceSummary.title).toEqual(workspaceTitle);
  if (workspaceDescription) expect(workspaceSummary.description).toEqual(workspaceDescription);
}
