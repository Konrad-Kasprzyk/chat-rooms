import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import handleApiError from "backend/request_utils/handleApiError.util";
import deleteUser from "backend/user/deleteUser.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(req);
    await deleteUser(uid, testCollections);
    res.status(204).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
