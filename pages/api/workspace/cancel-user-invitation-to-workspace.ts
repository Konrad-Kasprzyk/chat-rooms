import { FieldValue } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import checkPostRequest from "../../../backend/request_utils/checkPostRequest.util";
import Workspace from "../../../common/models/workspace.model";
import ApiError from "../../../common/types/apiError.class";
import { adminDb } from "../../../db/firebase-admin";

/**
 * @returns User id which invitation to the workspace was deleted.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, collections } = await checkPostRequest(req);
    const { workspaceId = undefined, userId = undefined } = { ...req.body };
    if (!workspaceId || typeof workspaceId !== "string")
      return res.status(400).send("Workspace id is missing or is not a non-empty string.");
    if (!userId || typeof userId !== "string")
      return res.status(400).send("No user ID provided to cancel workspace invitation.");
    const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
    const userToCancelInvitationRef = adminDb.collection(collections.users).doc(userId);

    return adminDb
      .runTransaction(async (transaction) => {
        const workspaceSnap = await transaction.get(workspaceRef);
        if (!workspaceSnap.exists) throw "Workspace with id " + workspaceId + " not found.";
        const userToCancelInvitationSnap = await transaction.get(userToCancelInvitationRef);
        if (!userToCancelInvitationSnap.exists)
          throw "User to cancel workspace invitation with id " + userId + " not found.";
        const workspace = workspaceSnap.data() as Workspace;
        if (!workspace.userIds.some((id) => id === uid))
          throw "Signed in user doesn't belong to the workspace with id " + workspaceId;
        if (!workspace.invitedUserIds.some((id) => id === userId))
          throw (
            "The user to cancel invitation with id " + userId + " is not invited to the workspace."
          );

        transaction.update(workspaceRef, {
          invitedUserIds: FieldValue.arrayRemove(userId),
        });
        transaction.update(userToCancelInvitationRef, {
          workspaceInvitations: FieldValue.arrayRemove({
            id: workspace.id,
            title: workspace.title,
            description: workspace.description,
          }),
        });
      })
      .then(() => res.status(201).send(userId));
  } catch (e: any) {
    if (e instanceof ApiError) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
