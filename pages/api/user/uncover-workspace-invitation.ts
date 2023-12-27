import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import uncoverWorkspaceInvitation from "backend/user/uncoverWorkspaceInvitation.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles a request to uncover a hidden workspace invitation for a user.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await uncoverWorkspaceInvitation(uid, workspaceId, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
