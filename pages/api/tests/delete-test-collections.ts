import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import checkTestApiRequest from "backend/test_utils/checkTestApiRequest.util";
import deleteTestCollections from "backend/test_utils/deleteTestCollections.util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkTestApiRequest(req, false);
    const testsId = getBodyStringParam(req.body, "testsId");
    await deleteTestCollections(testsId);
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
