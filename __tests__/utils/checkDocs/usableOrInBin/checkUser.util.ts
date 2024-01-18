import adminCollections from "backend/db/adminCollections.firebase";
import validateUser from "common/modelValidators/validateUser.util";
import validateUserDetails from "common/modelValidators/validateUserDetails.util";

/**
 * Validate the user and the user details documents with the workspaces and workspace summaries
 * to which the user belongs or has been invited.
 * @throws {Error} If any of the documents to validate are not found. When the user document is
 * marked as deleted.
 */
export default async function checkUser(uid: string) {
  const user = (await adminCollections.users.doc(uid).get()).data();
  if (!user || user.isDeleted)
    throw new Error("User document is not found or is marked as deleted.");
  validateUser(user);
  expect(user.id).toEqual(uid);
  expect(user.modificationTime.toDate() <= new Date()).toBeTrue();

  const userDetails = (await adminCollections.userDetails.doc(uid).get()).data();
  if (!userDetails || userDetails.isDeleted)
    throw new Error("User details document is not found or is marked as deleted.");
  validateUserDetails(userDetails);
  expect(userDetails.id).toEqual(uid);
  for (const workspaceId of userDetails.hiddenWorkspaceInvitationsIds) {
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
    .where("invitedUserEmails", "array-contains", user.email)
    .get();
  expect(invitingWorkspaceSummariesSnap.size).toEqual(user.workspaceInvitationIds.length);
  for (const invitingWorkspaceSummary of invitingWorkspaceSummariesSnap.docs.map((doc) =>
    doc.data()
  )) {
    expect(invitingWorkspaceSummary.invitedUserEmails).toContain(user.email);
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
    expect(belongingWorkspaceSummary.invitedUserEmails).not.toContain(user.email);
  }
}
