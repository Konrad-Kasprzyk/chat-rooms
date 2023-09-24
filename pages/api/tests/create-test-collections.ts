import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import createTestCollections from "backend/test_utils/createTestCollections.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkScriptApiRequest(req);
    const requiredAuthenticatedUserId = getBodyStringParam(req.body, "requiredAuthenticatedUserId");
    const testCollectionsId = getBodyStringParam(req.body, "testCollectionsId");
    const testsId = getBodyStringParam(req.body, "testsId");
    await createTestCollections(testCollectionsId, testsId, requiredAuthenticatedUserId);
    res.status(201).send(testCollectionsId);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
