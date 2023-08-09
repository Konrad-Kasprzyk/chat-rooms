import {
  getBodyStringArrayParam,
  getBodyStringParam,
} from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import checkTestApiRequest from "backend/test_utils/checkTestApiRequest.util";
import removeUsersFromWorkspace from "backend/test_utils/removeUsersFromWorkspace.util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkTestApiRequest(req);
    const userIds = getBodyStringArrayParam(req.body, "userIds");
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await removeUsersFromWorkspace(userIds, workspaceId, testCollections);
    res.status(200).send(workspaceId);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
