import Workspace from "common/models/workspace_models/workspace.model";
import adminArrayRemove from "db/admin/adminArrayRemove.util";
import { AdminCollections, adminAuth, adminDb } from "db/admin/firebase-admin";

export default async function deleteUser(
  uid: string,
  collections: typeof AdminCollections = AdminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const workspacesWhichInvitedUserQuery = collections.workspaces.where(
    "invitedUserIds",
    "array-contains",
    uid
  );
  const workspacesWhichUserBelongedQuery = collections.workspaces.where(
    "userIds",
    "array-contains",
    uid
  );

  await adminDb.runTransaction(async (transaction) => {
    await transaction.get(userRef);
    const workspacesWhichInvitedUserSnap = await transaction.get(
      workspacesWhichInvitedUserQuery.query
    );
    const workspacesWhichUserBelongedSnap = await transaction.get(
      workspacesWhichUserBelongedQuery.query
    );
    transaction.delete(userRef);
    for (const workspaceSnap of workspacesWhichInvitedUserSnap.docs)
      transaction.update(workspaceSnap.ref, {
        invitedUserIds: adminArrayRemove<Workspace, "invitedUserIds">(uid),
      });
    for (const workspaceSnap of workspacesWhichUserBelongedSnap.docs)
      transaction.update(workspaceSnap.ref, {
        userIds: adminArrayRemove<Workspace, "userIds">(uid),
      });
  });
  return adminAuth.deleteUser(uid);
}
