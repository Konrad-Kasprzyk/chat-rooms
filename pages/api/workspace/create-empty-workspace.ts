import checkPostRequest from "backend/request_utils/checkPostRequest";
import { getBodyStringParam } from "backend/request_utils/getBodyParam";
import handleRequestError from "backend/request_utils/handleRequestError";
import { createEmptyWorkspace } from "backend/workspace/createEmptyWorkspace";
import COLLECTIONS from "common/constants/collections";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This is an async function that handles a POST request to create an empty workspace, with various
 * checks for required parameters and error handling.
 * @returns Sends the id of the created workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkPostRequest(req);
    const collections = testCollections ? testCollections : COLLECTIONS;
    const url = getBodyStringParam(req.body, "url");
    const title = getBodyStringParam(req.body, "title");
    const description = getBodyStringParam(req.body, "description", false);
    const workspace = await createEmptyWorkspace(uid, url, title, description, collections);
    res.status(201).send(workspace.id);
  } catch (err: any) {
    handleRequestError(err, res);
  }
}
