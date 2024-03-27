import validateWorkspaceCounterDTO from "__tests__/utils/modelValidators/DTOModelValidators/utilsModels/validateWorkspaceCounterDTO.util";
import validateWorkspaceDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateWorkspaceDTO.util";
import validateWorkspaceSummaryDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateWorkspaceSummaryDTO.util";
import adminCollections from "backend/db/adminCollections.firebase";

/**
 * Validate the workspace, workspace summary and workspace counter documents.
 * Validate documents of users who belong to the workspace or have been invited.
 * The workspace to be validated may be in the recycle bin.
 * @throws {Error} If any of the documents to validate are not found. When either workspace
 * or workspace summary documents are marked as deleted.
 */
export default async function checkWorkspace(workspaceId: string) {
  /**
   * It also validates the data of users marked as deleted also. Their data should be valid even
   * after being marked as deleted, as they cannot be modified afterwards.
   */

  const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data();
  if (!workspace || workspace.isDeleted)
    throw new Error("Workspace document is not found or is marked as deleted.");
  validateWorkspaceDTO(workspace);
  expect(workspace.id).toEqual(workspaceId);
  expect(workspace.modificationTime.toDate() <= new Date()).toBeTrue();
  expect(workspace.creationTime.toDate() <= workspace.modificationTime.toDate()).toBeTrue();
  if (workspace.isInBin) {
    expect(workspace.placingInBinTime!.toDate() <= workspace.modificationTime.toDate()).toBeTrue();
    expect(workspace.creationTime.toDate() <= workspace.placingInBinTime!.toDate()).toBeTrue();
  }

  // Check if only one workspace exists with the workspace url.
  const workspacesSnap = await adminCollections.workspaces
    .where("isDeleted", "==", false)
    .where("url", "==", workspace.url)
    .get();
  expect(workspacesSnap.size).toEqual(1);

  const workspaceSummary = (
    await adminCollections.workspaceSummaries.doc(workspaceId).get()
  ).data();
  if (!workspaceSummary || workspaceSummary.isDeleted)
    throw new Error("Workspace summary document is not found or is marked as deleted.");
  validateWorkspaceSummaryDTO(workspaceSummary);
  expect(workspaceSummary.id).toEqual(workspaceId);
  expect(workspaceSummary.url).toEqual(workspace.url);
  expect(workspaceSummary.title).toEqual(workspace.title);
  expect(workspaceSummary.description).toEqual(workspace.description);
  expect(workspaceSummary.userIds).toEqual(workspace.userIds);
  expect(workspaceSummary.invitedUserIds.length).toEqual(workspace.invitedUserEmails.length);
  expect(workspaceSummary.modificationTime!.toDate().getTime()).toEqual(
    workspace.modificationTime.toDate().getTime()
  );
  expect(workspaceSummary.creationTime.toDate().getTime()).toEqual(
    workspace.creationTime.toDate().getTime()
  );
  if (workspaceSummary.isInBin) {
    expect(workspace.isInBin).toBeTrue();
    expect(workspaceSummary.placingInBinTime!.toDate().getTime()).toEqual(
      workspace.placingInBinTime!.toDate().getTime()
    );
  }

  // Check if only one workspace summary exists with the workspace url.
  const workspaceSummariesSnap = await adminCollections.workspaceSummaries
    .where("isDeleted", "==", false)
    .where("url", "==", workspace.url)
    .get();
  expect(workspaceSummariesSnap.size).toEqual(1);

  const workspaceCounter = (await adminCollections.workspaceCounters.doc(workspaceId).get()).data();
  if (!workspaceCounter) throw new Error("Workspace counter document to validate not found.");
  validateWorkspaceCounterDTO(workspaceCounter);
  expect(workspaceCounter.id).toEqual(workspaceId);

  const invitedUsersSnap = await adminCollections.users
    .where("workspaceInvitationIds", "array-contains", workspaceId)
    .get();
  expect(invitedUsersSnap.size).toEqual(workspace.invitedUserEmails.length);
  for (const invitedUser of invitedUsersSnap.docs.map((doc) => doc.data())) {
    expect(invitedUser.workspaceInvitationIds).toContain(workspaceId);
    expect(invitedUser.workspaceIds).not.toContain(workspaceId);
  }

  const belongingUsersSnap = await adminCollections.users
    .where("workspaceIds", "array-contains", workspaceId)
    .get();
  expect(belongingUsersSnap.size).toEqual(workspace.userIds.length);
  for (const belongingUser of belongingUsersSnap.docs.map((doc) => doc.data())) {
    expect(belongingUser.workspaceIds).toContain(workspaceId);
    expect(belongingUser.workspaceInvitationIds).not.toContain(workspaceId);
  }
}
