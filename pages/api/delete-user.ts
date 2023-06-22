import { adminAuth, adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import COLLECTIONS from "global/constants/collections";
import MessageWithCode from "global/types/messageWithCode";
import checkPostRequest from "global/utils/admin_utils/checkPostRequest";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkPostRequest(req);
    const collections = testCollections ? testCollections : COLLECTIONS;
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

    return adminAuth.deleteUser(uid).then(() => res.status(204).end());
  } catch (e: any) {
    if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
