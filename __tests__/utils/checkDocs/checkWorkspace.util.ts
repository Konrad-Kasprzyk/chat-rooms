import adminCollections from "backend/db/adminCollections.firebase";
import validateWorkspace from "common/model_validators/validateWorkspace.util";
import validateWorkspaceCounter from "common/model_validators/validateWorkspaceCounter.util";
import validateWorkspaceSummary from "common/model_validators/validateWorkspaceSummary.util";

/**
 * Validate the workspace, workspace summary and workspace counter documents.
 * Validate documents of users who belong to the workspace or have been invited.
 * @throws {Error} If any of the documents to validate are not found. When either workspace
 * or workspace summary documents are marked as deleted.
 */
export default async function checkWorkspace(workspaceId: string) {
  const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data();
  if (!workspace || workspace.isDeleted)
    throw new Error("Workspace document is not found or is marked as deleted.");
  validateWorkspace(workspace);
  expect(workspace.id).toEqual(workspaceId);
  expect(workspace.deletionTime).toBeNull();
  expect(workspace.modificationTime.toDate() <= new Date()).toBeTrue();
  expect(workspace.creationTime.toDate() <= workspace.modificationTime.toDate()).toBeTrue();
  if (workspace.isInBin) {
    expect(workspace.insertedIntoBinByUserId).toBeString();
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
  validateWorkspaceSummary(workspaceSummary);
  expect(workspaceSummary.id).toEqual(workspaceId);
  expect(workspaceSummary.deletionTime).toBeNull();
  expect(workspaceSummary.url).toEqual(workspace.url);
  expect(workspaceSummary.title).toEqual(workspace.title);
  expect(workspaceSummary.description).toEqual(workspace.description);
  expect(workspaceSummary.userIds).toEqual(workspace.userIds);
  expect(workspaceSummary.invitedUserEmails).toEqual(workspace.invitedUserEmails);
  expect(workspaceSummary.modificationTime.toDate().getTime()).toEqual(
    workspace.modificationTime.toDate().getTime()
  );
  expect(workspaceSummary.creationTime.toDate().getTime()).toEqual(
    workspace.creationTime.toDate().getTime()
  );
  if (workspaceSummary.isInBin) {
    expect(workspace.isInBin).toBeTrue();
    expect(workspaceSummary.insertedIntoBinByUserId).toBeString();
    expect(workspaceSummary.insertedIntoBinByUserId).toEqual(workspace.insertedIntoBinByUserId);
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
  validateWorkspaceCounter(workspaceCounter);
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
