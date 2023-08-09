import checkApiRequest from "backend/request_utils/checkApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import changeWorkspaceTitleOrDescription from "backend/workspace/changeWorkspaceTitleOrDescription.util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    const newDescription = getBodyStringParam(req.body, "newDescription");
    changeWorkspaceTitleOrDescription(
      uid,
      workspaceId,
      newDescription,
      "description",
      testCollections
    ).then(() => res.status(204).end());
  } catch (err: any) {
    handleApiError(err, res);
  }
}
