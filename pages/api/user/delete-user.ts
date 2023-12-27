import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyNumberParam, getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import deleteUser from "backend/user/deleteUser.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  let maxOperationsPerBatch: number | undefined = undefined;
  try {
    maxOperationsPerBatch = getBodyNumberParam(req.body, "maxDocumentDeletesPerBatch");
  } catch (err: any) {}

  try {
    const { testCollections = undefined } = checkScriptApiRequest(req);
    const userId = getBodyStringParam(req.body, "userId");
    await deleteUser(userId, testCollections, maxOperationsPerBatch);
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
