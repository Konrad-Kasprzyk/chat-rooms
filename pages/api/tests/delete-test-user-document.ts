import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import ApiError from "common/types/apiError.class";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkScriptApiRequest(req);
    if (!testCollections) throw new ApiError(400, "Test collections id is not a non-empty string");
    const userId = getBodyStringParam(req.body, "userId");
    await testCollections.users.doc(userId).delete();
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
