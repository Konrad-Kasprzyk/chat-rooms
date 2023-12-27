import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import inviteUserToWorkspace from "backend/workspace/inviteUserToWorkspace.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This function handles an API request to invite a user to a workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    const targetUserEmail = getBodyStringParam(req.body, "targetUserEmail");
    await inviteUserToWorkspace(uid, workspaceId, targetUserEmail, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
