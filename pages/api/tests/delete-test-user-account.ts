import { getBodyStringParam } from "backend/request_utils/getBodyParam";
import handleRequestError from "backend/request_utils/handleRequestError";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest";
import { adminAuth } from "db/firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkTestPostRequest(req, false);
    const userId = getBodyStringParam(req.body, "userId");
    await adminAuth.deleteUser(userId);
    res.status(204).end();
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
