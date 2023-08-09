import checkApiRequest from "backend/request_utils/checkApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import changeWorkspaceTitleOrDescription from "backend/workspace/changeWorkspaceTitleOrDescription.util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    const newTitle = getBodyStringParam(req.body, "newTitle");
    changeWorkspaceTitleOrDescription(uid, workspaceId, newTitle, "title", testCollections).then(
      () => res.status(204).end()
    );
  } catch (err: any) {
    handleApiError(err, res);
  }
}
