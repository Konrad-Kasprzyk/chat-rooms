import handleApiError from "backend/request_utils/handleApiError.util";
import checkTestApiRequest from "backend/test_utils/checkTestApiRequest.util";
import createGlobalCounter from "backend/test_utils/createGlobalCounter.util";
import GLOBAL_COUNTER_ID from "common/constants/globalCounterId.constant";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { testCollections } = checkTestApiRequest(req);
    await createGlobalCounter(testCollections);
    res.status(201).send(GLOBAL_COUNTER_ID);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
