import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import type { NextApiRequest, NextApiResponse } from "next";
import checkApiRequest from "../../../backend/request_utils/checkScriptApiRequest.util";
import ApiError from "../../../common/types/apiError.class";

/**
 * @returns User id added to the workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkApiRequest(req);
    const collections = testCollections ? testCollections : adminCollections;
    const { workspaceId = undefined } = { ...req.body };
    if (!workspaceId || typeof workspaceId !== "string")
      return res.status(400).send("Workspace id is missing or is not a non-empty string.");
    const workspaceRef = collections.workspaces.doc(workspaceId);
    const userRef = collections.users.doc(uid);

    return adminDb
      .runTransaction(async (transaction) => {
        const workspace = (await transaction.get(workspaceRef)).data();
        if (!workspace) throw "Workspace with id " + workspaceId + " not found.";
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists)
          throw "User to accept the workspace invitation with id " + uid + " not found.";
        if (!workspace.invitedUserIds.some((id) => id === uid))
          throw (
            "The user with the id " +
            uid +
            " to accept the invitation is not invited to the workspace."
          );

        transaction.update(workspaceRef, {
          invitedUserIds: adminArrayRemove<Workspace, "invitedUserIds">(uid),
          userIds: adminArrayUnion<Workspace, "userIds">(uid),
        });
        transaction.update(userRef, {
          workspaceInvitations: adminArrayRemove<User, "workspaceInvitations">({
            id: workspace.id,
            url: workspace.url,
            title: workspace.title,
            description: workspace.description,
          }),
          workspaces: adminArrayUnion<User, "workspaces">({
            id: workspace.id,
            url: workspace.url,
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
