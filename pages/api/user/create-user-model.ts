import checkApiRequest from "backend/request_utils/checkApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import createUserModel from "backend/user/createUserModel.util";
import COLLECTIONS from "common/constants/collections.constant";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This is an async function that handles a POST request, validates the request body, verifies an
 * idToken, and creates a user model.
 * @returns Sends the id of the created user document.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, email, testCollections } = await checkApiRequest(req);
    const collections = testCollections ? testCollections : COLLECTIONS;
    const username = getBodyStringParam(req.body, "username", false);
    const userModel = await createUserModel(uid, username, email, collections);
    res.status(201).send(userModel.id);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
