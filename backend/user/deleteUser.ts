import COLLECTIONS from "common/constants/collections";
import Collections from "common/types/collections";
import { adminAuth, adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export default async function deleteUser(
  uid: string,
  collections: Collections = COLLECTIONS
): Promise<void> {
  const userRef = adminDb.collection(collections.users).doc(uid);
  const workspacesWhichInvitedUserRef = adminDb
    .collection(collections.workspaces)
    .where("invitedUserIds", "array-contains", uid);
  const workspacesWhichUserBelongedRef = adminDb
    .collection(collections.workspaces)
    .where("userIds", "array-contains", uid);

  await adminDb.runTransaction(async (transaction) => {
    await transaction.get(userRef);
    const workspacesWhichInvitedUserSnap = await transaction.get(workspacesWhichInvitedUserRef);
    const workspacesWhichUserBelongedSnap = await transaction.get(workspacesWhichUserBelongedRef);
    transaction.delete(userRef);
    for (const workspaceSnap of workspacesWhichInvitedUserSnap.docs)
      transaction.update(workspaceSnap.ref, { invitedUserIds: FieldValue.arrayRemove(uid) });
    for (const workspaceSnap of workspacesWhichUserBelongedSnap.docs)
      transaction.update(workspaceSnap.ref, { userIds: FieldValue.arrayRemove(uid) });
  });
  return adminAuth.deleteUser(uid);
}
