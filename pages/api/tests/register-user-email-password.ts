import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import checkTestApiRequest from "backend/test_utils/checkTestApiRequest.util";
import adminAuth from "db/admin/adminAuth.firebase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkTestApiRequest(req, false);
    const email = getBodyStringParam(req.body, "email");
    const password = getBodyStringParam(req.body, "password");
    const displayName = getBodyStringParam(req.body, "displayName");
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
    res.status(201).send(userRecord.uid);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
