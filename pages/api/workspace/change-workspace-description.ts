import checkPostRequest from "backend/request_utils/checkPostRequest";
import { getBodyStringParam } from "backend/request_utils/getBodyParam";
import handleRequestError from "backend/request_utils/handleRequestError";
import changeWorkspaceDescription from "backend/workspace/changeWorkspaceDescription";
import COLLECTIONS from "common/constants/collections";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkPostRequest(req);
    const collections = testCollections ? testCollections : COLLECTIONS;
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    const newDescription = getBodyStringParam(req.body, "newDescription");
    changeWorkspaceDescription(uid, workspaceId, newDescription, collections).then(() =>
      res.status(204).end()
    );
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
