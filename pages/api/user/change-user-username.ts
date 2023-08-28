import checkApiRequest from "backend/request_utils/checkApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import changeUserUsername from "backend/user/changeUserUsername.util";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This is an async function that handles a request to change a user's username and returns a response
 * with a status code of 200 if successful.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkApiRequest(req);
    const newUsername = getBodyStringParam(req.body, "newUsername", false);
    await changeUserUsername(uid, newUsername, testCollections);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
