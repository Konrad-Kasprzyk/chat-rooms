import adminAuth from "backend/db/adminAuth.firebase";
import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    checkScriptApiRequest(req);
    const userId = getBodyStringParam(req.body, "userId");
    await adminAuth.deleteUser(userId);
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
