import validateWorkspaceDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateWorkspaceDTO.util";
import validateWorkspaceSummaryDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateWorkspaceSummaryDTO.util";
import adminCollections from "backend/db/adminCollections.firebase";

/**
 * Validate the workspace documents and ensure to be deleted or marked as deleted.
 * @throws {Error} When documents are not consistent, like the workspace document is not found,
 * but the workspace summary document is found.
 */
export default async function checkDeletedWorkspace(workspaceId: string) {
  /**
   * It also validates the data of users marked as deleted also. Their data should be valid even
   * after being marked as deleted, as they cannot be modified afterwards.
   */

  const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data();
  if (workspace) {
    validateWorkspaceDTO(workspace);
    if (!workspace.isDeleted)
      throw new Error("The workspace document is not deleted or marked as deleted");
    expect(workspace.id).toEqual(workspaceId);
    expect(workspace.modificationTime.toDate() <= new Date()).toBeTrue();
    expect(workspace.creationTime.toDate() <= workspace.modificationTime.toDate()).toBeTrue();
    expect(workspace.isInBin).toBeTrue();
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
    expect(invitedUsersSnap.size).toEqual(0);

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
    validateWorkspaceSummaryDTO(workspaceSummary);
    if (!workspaceSummary.isDeleted)
      throw new Error("The workspace summary document is not deleted or marked as deleted");
    expect(workspaceSummary.id).toEqual(workspaceId);
    expect(workspaceSummary.url).toEqual(workspace!.url);
    expect(workspaceSummary.title).toEqual(workspace!.title);
    expect(workspaceSummary.description).toEqual(workspace!.description);
    expect(workspaceSummary.userIds).toEqual(workspace!.userIds);
    expect(workspaceSummary.invitedUserIds.length).toEqual(workspace!.invitedUserEmails.length);
    expect(workspaceSummary.modificationTime.toDate().getTime()).toEqual(
      workspace!.modificationTime.toDate().getTime()
    );
    expect(workspaceSummary.creationTime.toDate().getTime()).toEqual(
      workspace!.creationTime.toDate().getTime()
    );
    if (workspaceSummary.isInBin) {
      expect(workspace!.isInBin).toBeTrue();
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
}
