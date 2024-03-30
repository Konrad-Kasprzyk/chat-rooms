import validateUserDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateUserDTO.util";
import validateUserDetailsDTO from "__tests__/utils/modelValidators/DTOModelValidators/validateUserDetailsDTO.util";
import adminCollections from "backend/db/adminCollections.firebase";

/**
 * Validate the user and the user details documents with the workspaces and workspace summaries
 * to which the user belongs or has been invited.
 * @throws {Error} If any of the documents to validate are not found. When the user document is
 * marked as deleted.
 */
export default async function checkUser(uid: string) {
  /**
   * It also validates the data from workspaces put in the recycle bin and marked as deleted.
   * Their data should be valid even after being put in the recycle bin and marked as deleted,
   * as they cannot be modified afterwards.
   */

  const user = (await adminCollections.users.doc(uid).get()).data();
  if (!user) throw new Error("User document is not found.");
  validateUserDTO(user);
  expect(user.id).toEqual(uid);
  expect(user.modificationTime.toDate() <= new Date()).toBeTrue();

  const userDetails = (await adminCollections.userDetails.doc(uid).get()).data();
  if (!userDetails) throw new Error("User details document is not found.");
  validateUserDetailsDTO(userDetails);
  expect(userDetails.id).toEqual(uid);
  for (const workspaceId of userDetails.hiddenWorkspaceInvitationIds) {
    expect(user.workspaceInvitationIds).toContain(workspaceId);
    expect(user.workspaceIds).not.toContain(workspaceId);
  }

  const invitingWorkspacesSnap = await adminCollections.workspaces
    .where("invitedUserEmails", "array-contains", user.email)
    .get();
  expect(invitingWorkspacesSnap.size).toEqual(user.workspaceInvitationIds.length);
  for (const invitingWorkspace of invitingWorkspacesSnap.docs.map((doc) => doc.data())) {
    expect(invitingWorkspace.invitedUserEmails).toContain(user.email);
    expect(invitingWorkspace.userIds).not.toContain(user.id);
  }
  const invitingWorkspaceSummariesSnap = await adminCollections.workspaceSummaries
    .where("invitedUserIds", "array-contains", user.id)
    .get();
  expect(invitingWorkspaceSummariesSnap.size).toEqual(user.workspaceInvitationIds.length);
  for (const invitingWorkspaceSummary of invitingWorkspaceSummariesSnap.docs.map((doc) =>
    doc.data()
  )) {
    expect(invitingWorkspaceSummary.invitedUserIds).toContain(user.id);
    expect(invitingWorkspaceSummary.userIds).not.toContain(user.id);
  }

  const belongingWorkspacesSnap = await adminCollections.workspaces
    .where("userIds", "array-contains", user.id)
    .get();
  expect(belongingWorkspacesSnap.size).toEqual(user.workspaceIds.length);
  for (const belongingWorkspace of belongingWorkspacesSnap.docs.map((doc) => doc.data())) {
    expect(belongingWorkspace.userIds).toContain(user.id);
    expect(belongingWorkspace.invitedUserEmails).not.toContain(user.email);
  }
  const belongingWorkspaceSummariesSnap = await adminCollections.workspaceSummaries
    .where("userIds", "array-contains", user.id)
    .get();
  expect(belongingWorkspaceSummariesSnap.size).toEqual(user.workspaceIds.length);
  for (const belongingWorkspaceSummary of belongingWorkspaceSummariesSnap.docs.map((doc) =>
    doc.data()
  )) {
    expect(belongingWorkspaceSummary.userIds).toContain(user.id);
    expect(belongingWorkspaceSummary.invitedUserIds).not.toContain(user.id);
  }
}
