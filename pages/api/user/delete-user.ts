import checkApiRequest from "backend/request_utils/checkApiRequest.util";
import handleApiError from "backend/request_utils/handleApiError.util";
import deleteUser from "backend/user/deleteUser.util";
import COLLECTIONS from "common/constants/collections.constant";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkApiRequest(req);
    const collections = testCollections ? testCollections : COLLECTIONS;
    return deleteUser(uid, collections).then(() => res.status(204).end());
  } catch (err: any) {
    handleApiError(err, res);
  }
}
