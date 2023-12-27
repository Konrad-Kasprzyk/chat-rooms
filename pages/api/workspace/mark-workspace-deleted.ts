import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import markWorkspaceDeleted from "backend/workspace/markWorkspaceDeleted.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This function handles an API request to mark the workspace deleted
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections = undefined } = checkScriptApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await markWorkspaceDeleted(workspaceId, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
