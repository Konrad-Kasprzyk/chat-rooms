import { FieldValue } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "../../../db/firebase-admin";
import Workspace from "../../../global/models/workspace.model";
import MessageWithCode from "../../../global/types/messageWithCode";
import checkPostRequest from "../../../global/utils/admin_utils/checkPostRequest";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, collections } = await checkPostRequest(req);
    const { workspaceId = undefined, newDescription = undefined } = { ...req.body };
    if (!workspaceId || typeof workspaceId !== "string")
      return res
        .status(400)
        .send("Workspace id to change description is missing or is not a non-empty string.");
    if (!newDescription || typeof newDescription !== "string")
      return res
        .status(400)
        .send("Workspace new description is missing or is not a non-empty string.");
    const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);

    return adminDb
      .runTransaction(async (transaction) => {
        const workspaceSnap = await transaction.get(workspaceRef);
        if (!workspaceSnap.exists) throw "Workspace with id " + workspaceId + " not found.";
        const workspace = workspaceSnap.data() as Workspace;
        if (!workspace.userIds.some((id) => id === uid))
          throw "Signed in user doesn't belong to workspace with id " + workspaceId;
        const belongingUserRefs = workspace.userIds.map((id) =>
          adminDb.collection(collections.users).doc(id)
        );
        const invitedUserRefs = workspace.invitedUserIds.map((id) =>
          adminDb.collection(collections.users).doc(id)
        );
        const belongingUsersSnap = await transaction.getAll(...belongingUserRefs);
        const invitedUsersSnap = await transaction.getAll(...invitedUserRefs);
        for (const userSnap of belongingUsersSnap) {
          transaction.update(userSnap.ref, {
            workspaces: FieldValue.arrayRemove({
              id: workspace.id,
              title: workspace.title,
              description: workspace.description,
            }),
          });
          transaction.update(userSnap.ref, {
            workspaces: FieldValue.arrayUnion({
              id: workspace.id,
              title: workspace.title,
              description: newDescription,
            }),
          });
        }
        for (const userSnap of invitedUsersSnap) {
          transaction.update(userSnap.ref, {
            workspaceInvitations: FieldValue.arrayRemove({
              id: workspace.id,
              title: workspace.title,
              description: workspace.description,
            }),
          });
          transaction.update(userSnap.ref, {
            workspaceInvitations: FieldValue.arrayUnion({
              id: workspace.id,
              title: workspace.title,
              description: newDescription,
            }),
          });
        }
        transaction.update(workspaceRef, { description: newDescription });
      })
      .then(() => res.status(204).end());
  } catch (e: any) {
    if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
