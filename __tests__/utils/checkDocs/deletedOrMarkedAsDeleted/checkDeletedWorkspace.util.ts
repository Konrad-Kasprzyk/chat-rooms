import adminCollections from "backend/db/adminCollections.firebase";
import validateWorkspace from "common/modelValidators/validateWorkspace.util";
import validateWorkspaceCounter from "common/modelValidators/validateWorkspaceCounter.util";
import validateWorkspaceSummary from "common/modelValidators/validateWorkspaceSummary.util";

/**
 * Validate the workspace documents and ensure to be deleted or marked as deleted.
 * @throws {Error} When documents are not consistent, like the workspace document is not found,
 * but the workspace summary document is found.
 */
export default async function checkDeletedWorkspace(workspaceId: string) {
  const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data();
  if (workspace) {
    validateWorkspace(workspace);
    if (!workspace.isDeleted)
      throw new Error("The workspace document is not deleted or marked as deleted");
    expect(workspace.id).toEqual(workspaceId);
    expect(workspace.modificationTime.toDate() <= new Date()).toBeTrue();
    expect(workspace.creationTime.toDate() <= workspace.modificationTime.toDate()).toBeTrue();
    expect(workspace.isInBin).toBeTrue();
    expect(workspace.insertedIntoBinByUserId).toBeString();
    expect(workspace.placingInBinTime!.toDate() <= workspace.modificationTime.toDate()).toBeTrue();
    expect(workspace.creationTime.toDate() <= workspace.placingInBinTime!.toDate()).toBeTrue();

    // Check that there is no more than one workspace with the workspace url.
    const workspacesSnap = await adminCollections.workspaces
      .where("isDeleted", "==", false)
      .where("url", "==", workspace.url)
      .get();
    expect(workspacesSnap.size).toBeWithin(0, 1);
    // Check that there is at least one workspace marked deleted with the workspace url.
    const markedDeletedWorkspacesSnap = await adminCollections.workspaces
      .where("isDeleted", "==", true)
      .where("url", "==", workspace.url)
      .get();
    expect(markedDeletedWorkspacesSnap.size).toBeGreaterThan(0);

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
  } else {
    const invitedUsersSnap = await adminCollections.users
      .where("workspaceInvitationIds", "array-contains", workspaceId)
      .get();
    expect(invitedUsersSnap.size).toEqual(0);
    const belongingUsersSnap = await adminCollections.users
      .where("workspaceIds", "array-contains", workspaceId)
      .get();
    expect(belongingUsersSnap.size).toEqual(0);
  }

  const workspaceSummary = (
    await adminCollections.workspaceSummaries.doc(workspaceId).get()
  ).data();
  if (workspace && !workspaceSummary)
    throw new Error("Found workspace document, but the workspace summary document is not found.");
  if (!workspace && workspaceSummary)
    throw new Error("Workspace document not found, but found the workspace summary document.");
  if (workspaceSummary) {
    validateWorkspaceSummary(workspaceSummary);
    if (!workspaceSummary.isDeleted)
      throw new Error("The workspace summary document is not deleted or marked as deleted");
    expect(workspaceSummary.id).toEqual(workspaceId);
    expect(workspaceSummary.url).toEqual(workspace!.url);
    expect(workspaceSummary.title).toEqual(workspace!.title);
    expect(workspaceSummary.description).toEqual(workspace!.description);
    expect(workspaceSummary.userIds).toEqual(workspace!.userIds);
    expect(workspaceSummary.invitedUserEmails).toEqual(workspace!.invitedUserEmails);
    expect(workspaceSummary.modificationTime.toDate().getTime()).toEqual(
      workspace!.modificationTime.toDate().getTime()
    );
    expect(workspaceSummary.creationTime.toDate().getTime()).toEqual(
      workspace!.creationTime.toDate().getTime()
    );
    if (workspaceSummary.isInBin) {
      expect(workspace!.isInBin).toBeTrue();
      expect(workspaceSummary.insertedIntoBinByUserId).toBeString();
      expect(workspaceSummary.insertedIntoBinByUserId).toEqual(workspace!.insertedIntoBinByUserId);
      expect(workspaceSummary.placingInBinTime!.toDate().getTime()).toEqual(
        workspace!.placingInBinTime!.toDate().getTime()
      );
    }

    // Check that there is no more than one workspace summary with the workspace url.
    const workspaceSummariesSnap = await adminCollections.workspaceSummaries
      .where("isDeleted", "==", false)
      .where("url", "==", workspace!.url)
      .get();
    expect(workspaceSummariesSnap.size).toBeWithin(0, 1);
    // Check that there is at least one workspace summary marked deleted with the workspace url.
    const markedDeletedWorkspaceSummariesSnap = await adminCollections.workspaceSummaries
      .where("isDeleted", "==", true)
      .where("url", "==", workspace!.url)
      .get();
    expect(markedDeletedWorkspaceSummariesSnap.size).toBeGreaterThan(0);
  }

  const workspaceCounter = (await adminCollections.workspaceCounters.doc(workspaceId).get()).data();
  if (workspace && !workspaceCounter)
    throw new Error("Found workspace document, but the workspace counter document is not found.");
  if (!workspace && workspaceCounter)
    throw new Error("Workspace document not found, but found the workspace counter document.");
  if (workspaceCounter) {
    validateWorkspaceCounter(workspaceCounter);
    expect(workspaceCounter.id).toEqual(workspaceId);
  }
}
