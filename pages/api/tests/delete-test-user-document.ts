import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import checkTestApiRequest from "backend/test_utils/checkTestApiRequest.util";
import { adminDb } from "db/firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkTestApiRequest(req);
    const userId = getBodyStringParam(req.body, "userId");
    await adminDb.collection(testCollections.users).doc(userId).delete();
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
