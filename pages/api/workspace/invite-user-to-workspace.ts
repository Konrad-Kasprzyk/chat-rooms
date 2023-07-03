import { FieldValue } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import checkPostRequest from "../../../backend/request_utils/checkPostRequest";
import Workspace from "../../../common/models/workspace.model";
import ApiError from "../../../common/types/apiError";
import { adminAuth, adminDb } from "../../../db/firebase-admin";

/**
 * @returns User id invited to the workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, collections } = await checkPostRequest(req);
    const { workspaceId = undefined, userEmailToInvite = undefined } = { ...req.body };
    if (!workspaceId || typeof workspaceId !== "string")
      return res.status(400).send("Workspace id is missing or is not a non-empty string.");
    if (!userEmailToInvite || typeof userEmailToInvite !== "string")
      return res
        .status(400)
        .send("The user email who was to be invited to the workspace was not provided");
    const userRecordToInvite = await adminAuth.getUserByEmail(userEmailToInvite);
    const userIdToInvite = userRecordToInvite.uid;
    const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
    const userToInviteRef = adminDb.collection(collections.users).doc(userIdToInvite);

    return adminDb
      .runTransaction(async (transaction) => {
        const workspaceSnap = await transaction.get(workspaceRef);
        if (!workspaceSnap.exists) throw "Workspace with id " + workspaceId + " not found.";
        const userToInviteSnap = await transaction.get(userToInviteRef);
        if (!userToInviteSnap.exists)
          throw "User to invite to the workspace with id " + userIdToInvite + " not found.";
        const workspace = workspaceSnap.data() as Workspace;
        if (!workspace.userIds.some((id) => id === uid))
          throw "Signed in user doesn't belong to the workspace with id " + workspaceId;
        if (workspace.userIds.some((id) => id === userIdToInvite))
          throw "The user with id " + userIdToInvite + " already belongs to the workspace.";
        if (workspace.invitedUserIds.some((id) => id === userIdToInvite))
          throw "The user with id " + userIdToInvite + " is already invited to the workspace.";

        transaction.update(workspaceRef, {
          invitedUserIds: FieldValue.arrayUnion(userIdToInvite),
        });
        transaction.update(userToInviteRef, {
          workspaceInvitations: FieldValue.arrayUnion({
            id: workspace.id,
            title: workspace.title,
            description: workspace.description,
          }),
        });
      })
      .then(() => res.status(201).send(userIdToInvite));
  } catch (e: any) {
    if (e instanceof ApiError) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
