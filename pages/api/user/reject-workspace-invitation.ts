import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import rejectWorkspaceInvitation from "backend/user/rejectWorkspaceInvitation.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles a request to reject a workspace invitation.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await rejectWorkspaceInvitation(uid, workspaceId, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
