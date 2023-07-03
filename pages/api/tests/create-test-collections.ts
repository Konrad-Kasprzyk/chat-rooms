import { getBodyStringParam } from "backend/request_utils/getBodyParam";
import handleRequestError from "backend/request_utils/handleRequestError";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest";
import createTestCollections from "backend/test_utils/createTestCollections";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkTestPostRequest(req, false);
    const requiredAuthenticatedUserId = getBodyStringParam(req.body, "requiredAuthenticatedUserId");
    const testCollectionsId = getBodyStringParam(req.body, "testCollectionsId");
    const testsId = getBodyStringParam(req.body, "testsId");
    await createTestCollections(testCollectionsId, testsId, requiredAuthenticatedUserId);
    res.status(201).send(testCollectionsId);
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
