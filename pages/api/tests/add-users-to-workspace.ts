import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import {
  getBodyStringArrayParam,
  getBodyStringParam,
} from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import addUsersToWorkspace from "backend/test_utils/addUsersToWorkspace.service";
import ApiError from "common/types/apiError.class";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkScriptApiRequest(req);
    if (!testCollections) throw new ApiError(400, "Test collections id is not a non-empty string");
    const userIds = getBodyStringArrayParam(req.body, "userIds");
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await addUsersToWorkspace(userIds, workspaceId, testCollections);
    res.status(200).send(workspaceId);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
