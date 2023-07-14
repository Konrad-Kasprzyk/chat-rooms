import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleRequestError from "backend/request_utils/handleRequestError.util";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest.util";
import { adminDb } from "db/firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkTestPostRequest(req);
    const userId = getBodyStringParam(req.body, "userId");
    await adminDb.collection(testCollections.users).doc(userId).delete();
    res.status(204).end();
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
