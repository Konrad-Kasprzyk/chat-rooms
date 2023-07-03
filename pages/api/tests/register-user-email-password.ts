import { getBodyStringParam } from "backend/request_utils/getBodyParam";
import handleRequestError from "backend/request_utils/handleRequestError";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest";
import { adminAuth } from "db/firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkTestPostRequest(req, false);
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
    handleRequestError(err, res);
  }
}
