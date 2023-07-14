import {
  getBodyStringArrayParam,
  getBodyStringParam,
} from "backend/request_utils/getBodyParam.utils";
import handleRequestError from "backend/request_utils/handleRequestError.util";
import { addUsersToWorkspace } from "backend/test_utils/addUsersToWorkspace.util";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest.util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkTestPostRequest(req);
    const userIds = getBodyStringArrayParam(req.body, "userIds");
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await addUsersToWorkspace(userIds, workspaceId, testCollections);
    res.status(200).send(workspaceId);
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
