import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleRequestError from "backend/request_utils/handleRequestError.util";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest.util";
import deleteTestCollections from "backend/test_utils/deleteTestCollections.util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkTestPostRequest(req, false);
    const testsId = getBodyStringParam(req.body, "testsId");
    await deleteTestCollections(testsId);
    res.status(204).end();
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
