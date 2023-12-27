import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import moveWorkspaceToRecycleBin from "backend/workspace/moveWorkspaceToRecycleBin.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This function handles an API request to move the workspace to the recycle bin.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await moveWorkspaceToRecycleBin(uid, workspaceId, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
