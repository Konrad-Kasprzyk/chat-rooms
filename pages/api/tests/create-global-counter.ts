import handleRequestError from "backend/request_utils/handleRequestError";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest";
import createGlobalCounter from "backend/test_utils/createGlobalCounter";
import GLOBAL_COUNTER_ID from "common/constants/globalCounterId";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkTestPostRequest(req);
    await createGlobalCounter(testCollections);
    res.status(201).send(GLOBAL_COUNTER_ID);
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
