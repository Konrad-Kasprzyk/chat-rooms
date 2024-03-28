import adminCollections from "backend/db/adminCollections.firebase";

/**
 * Ensure that user documents are deleted.
 */
export default async function checkDeletedUser(uid: string) {
  const user = await adminCollections.users.doc(uid).get();
  expect(user.exists).toBeFalse();
  const userDetails = await adminCollections.userDetails.doc(uid).get();
  expect(userDetails.exists).toBeFalse();
  const belongingWorkspacesSnap = await adminCollections.workspaces
    .where("userIds", "array-contains", uid)
    .get();
  expect(belongingWorkspacesSnap.size).toEqual(0);
  const belongingWorkspaceSummariesSnap = await adminCollections.workspaceSummaries
    .where("userIds", "array-contains", uid)
    .get();
  expect(belongingWorkspaceSummariesSnap.size).toEqual(0);
  const invitingWorkspaceSummariesSnap = await adminCollections.workspaceSummaries
    .where("invitedUserIds", "array-contains", uid)
    .get();
  expect(invitingWorkspaceSummariesSnap.size).toEqual(0);
}
