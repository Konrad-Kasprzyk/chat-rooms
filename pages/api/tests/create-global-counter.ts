import handleRequestError from "backend/request_utils/handleRequestError.util";
import checkTestPostRequest from "backend/test_utils/checkTestPostRequest.util";
import createGlobalCounter from "backend/test_utils/createGlobalCounter.util";
import GLOBAL_COUNTER_ID from "common/constants/globalCounterId.constant";
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
