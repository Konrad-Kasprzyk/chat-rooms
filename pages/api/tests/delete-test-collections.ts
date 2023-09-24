import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import deleteTestCollections from "backend/test_utils/deleteTestCollections.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkScriptApiRequest(req);
    const testsId = getBodyStringParam(req.body, "testsId");
    await deleteTestCollections(testsId);
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
