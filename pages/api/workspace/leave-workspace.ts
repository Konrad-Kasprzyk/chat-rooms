import { FieldValue } from "firebase-admin/firestore";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import checkApiRequest from "../../../backend/request_utils/checkApiRequest.util";
import Workspace from "../../../common/models/workspace_models/workspace.model";
import ApiError from "../../../common/types/apiError.class";
import { adminDb } from "../../../db/admin/firebase-admin";

/**
 * @returns Id of the left workspace.
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
          throw "The user with id " + uid + " to leave the workspace was not found.";
        const workspace = workspaceSnap.data() as Workspace;
        if (!workspace.userIds.some((id) => id === uid))
          throw "Signed in user doesn't belong to the workspace with id " + workspaceId;
        // Insert workspace into the bin, if no user is left (does not count invited users)
        transaction.update(workspaceRef, {
          userIds: FieldValue.arrayRemove(uid),
          ...(workspace.userIds.length <= 1
            ? {
                inRecycleBin: true,
                placingInBinTime: serverTimestamp() as Timestamp,
                insertedIntoBinByUserId: uid,
              }
            : {}),
        });
        transaction.update(userRef, {
          workspaces: FieldValue.arrayRemove({
            id: workspace.id,
            title: workspace.title,
            description: workspace.description,
          }),
        });
      })
      .then(() => res.status(201).send(workspaceId));
  } catch (e: any) {
    if (e instanceof ApiError) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
