import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import createUserDocument from "backend/user/createUserDocument.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This is an async function that handles a POST request, validates the request body, verifies an
 * idToken, and creates a user model.
 * @returns Sends the id of the created user document.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, email, testCollections = undefined } = await checkUserApiRequest(req);
    const username = getBodyStringParam(req.body, "username", false);
    const userModel = await createUserDocument(uid, username, email, testCollections);
    res.status(201).send(userModel.id);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
