import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import changeWorkspaceDescription from "backend/workspace/changeWorkspaceDescription.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    const newDescription = getBodyStringParam(req.body, "newDescription");
    await changeWorkspaceDescription(uid, workspaceId, newDescription, testCollections);
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
