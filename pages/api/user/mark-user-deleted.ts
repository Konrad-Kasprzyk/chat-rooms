import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import handleApiError from "backend/request_utils/handleApiError.util";
import markUserDeleted from "backend/user/markUserDeleted.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles a request to mark the user deleted.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    await markUserDeleted(uid, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
