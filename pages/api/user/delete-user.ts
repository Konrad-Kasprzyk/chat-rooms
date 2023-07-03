import checkPostRequest from "backend/request_utils/checkPostRequest";
import handleRequestError from "backend/request_utils/handleRequestError";
import deleteUser from "backend/user/deleteUser";
import COLLECTIONS from "common/constants/collections";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkPostRequest(req);
    const collections = testCollections ? testCollections : COLLECTIONS;
    return deleteUser(uid, collections).then(() => res.status(204).end());
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
