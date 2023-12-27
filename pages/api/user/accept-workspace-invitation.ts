import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import acceptWorkspaceInvitation from "backend/user/acceptWorkspaceInvitation.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles a request to accept a workspace invitation.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await acceptWorkspaceInvitation(uid, workspaceId, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
