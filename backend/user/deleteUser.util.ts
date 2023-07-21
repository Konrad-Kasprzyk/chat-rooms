import COLLECTIONS from "common/constants/collections.constant";
import Workspace from "common/models/workspace_models/workspace.model";
import Collections from "common/types/collections.type";
import { adminAuth, adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export default async function deleteUser(
  uid: string,
  collections: Collections = COLLECTIONS
): Promise<void> {
  const userRef = adminDb.collection(collections.users).doc(uid);
  const workspacesWhichInvitedUserRef = adminDb
    .collection(collections.workspaces)
    .where(
      "invitedUserIds" satisfies keyof Workspace,
      "array-contains",
      uid satisfies Workspace["invitedUserIds"][number]
    );
  const workspacesWhichUserBelongedRef = adminDb
    .collection(collections.workspaces)
    .where(
      "userIds" satisfies keyof Workspace,
      "array-contains",
      uid satisfies Workspace["userIds"][number]
    );

  await adminDb.runTransaction(async (transaction) => {
    await transaction.get(userRef);
    const workspacesWhichInvitedUserSnap = await transaction.get(workspacesWhichInvitedUserRef);
    const workspacesWhichUserBelongedSnap = await transaction.get(workspacesWhichUserBelongedRef);
    transaction.delete(userRef);
    for (const workspaceSnap of workspacesWhichInvitedUserSnap.docs)
      transaction.update(workspaceSnap.ref, {
        invitedUserIds: FieldValue.arrayRemove(uid satisfies Workspace["invitedUserIds"][number]),
      });
    for (const workspaceSnap of workspacesWhichUserBelongedSnap.docs)
      transaction.update(workspaceSnap.ref, {
        userIds: FieldValue.arrayRemove(uid satisfies Workspace["userIds"][number]),
      });
  });
  return adminAuth.deleteUser(uid);
}
