import checkApiRequest from "backend/request_utils/checkApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import changeWorkspaceTitle from "backend/workspace/changeWorkspaceTitle.util";
import COLLECTIONS from "common/constants/collections.constant";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkApiRequest(req);
    const collections = testCollections ? testCollections : COLLECTIONS;
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    const newTitle = getBodyStringParam(req.body, "newTitle");
    changeWorkspaceTitle(uid, workspaceId, newTitle, collections).then(() => res.status(204).end());
  } catch (err: any) {
    handleApiError(err, res);
  }
}
