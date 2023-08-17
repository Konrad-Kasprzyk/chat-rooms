import adminDb from "backend/db/adminDb.firebase";
import { FieldValue } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import checkApiRequest from "../../../backend/request_utils/checkApiRequest.util";
import Workspace from "../../../common/models/workspace_models/workspace.model";
import ApiError from "../../../common/types/apiError.class";

/**
 * @returns User id added to the workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, collections } = await checkApiRequest(req);
    const { workspaceId = undefined } = { ...req.body };
    if (!workspaceId || typeof workspaceId !== "string")
      return res.status(400).send("Workspace id is missing or is not a non-empty string.");
    const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
    const userRef = adminDb.collection(collections.users).doc(uid);

    return adminDb
      .runTransaction(async (transaction) => {
        const workspaceSnap = await transaction.get(workspaceRef);
        if (!workspaceSnap.exists) throw "Workspace with id " + workspaceId + " not found.";
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists)
          throw "User to reject the workspace invitation with id " + uid + " not found.";
        const workspace = workspaceSnap.data() as Workspace;
        if (!workspace.invitedUserIds.some((id) => id === uid))
          throw (
            "The user with id " + uid + " to reject the invitation is not invited to the workspace."
          );

        transaction.update(workspaceRef, {
          invitedUserIds: FieldValue.arrayRemove(uid),
        });
        transaction.update(userRef, {
          workspaceInvitations: FieldValue.arrayRemove({
            id: workspace.id,
            title: workspace.title,
            description: workspace.description,
          }),
        });
      })
      .then(() => res.status(201).send(uid));
  } catch (e: any) {
    if (e instanceof ApiError) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
