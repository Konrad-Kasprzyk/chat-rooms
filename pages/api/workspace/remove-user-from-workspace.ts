import adminDb from "db/admin/adminDb.firebase";
import { FieldValue } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import checkApiRequest from "../../../backend/request_utils/checkApiRequest.util";
import Workspace from "../../../common/models/workspace_models/workspace.model";
import ApiError from "../../../common/types/apiError.class";

/**
 * @returns User id removed from the workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, collections } = await checkApiRequest(req);
    const { workspaceId = undefined, userId = undefined } = { ...req.body };
    if (!workspaceId || typeof workspaceId !== "string")
      return res.status(400).send("Workspace id is missing or is not a non-empty string.");
    if (!userId || typeof userId !== "string")
      return res.status(400).send("No user ID provided to remove from the workspace.");
    if (uid === userId)
      return res
        .status(400)
        .send(
          "User cannot remove himself from the workspace. Use function to leave the workspace instead."
        );
    const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
    const userToRemoveFromWorkspaceRef = adminDb.collection(collections.users).doc(userId);

    return adminDb
      .runTransaction(async (transaction) => {
        const workspaceSnap = await transaction.get(workspaceRef);
        if (!workspaceSnap.exists) throw "Workspace with id " + workspaceId + " not found.";
        const userToRemoveFromWorkspaceSnap = await transaction.get(userToRemoveFromWorkspaceRef);
        if (!userToRemoveFromWorkspaceSnap.exists)
          throw "User to remove from the workspace with id " + userId + " not found.";
        const workspace = workspaceSnap.data() as Workspace;
        if (!workspace.userIds.some((id) => id === uid))
          throw "Signed in user doesn't belong to the workspace with id " + workspaceId;
        if (!workspace.userIds.some((id) => id === userId))
          throw (
            "The user with id " +
            userId +
            " to remove from the workspace does not belong to the workspace."
          );

        transaction.update(workspaceRef, {
          userIds: FieldValue.arrayRemove(userId),
        });
        transaction.update(userToRemoveFromWorkspaceRef, {
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
