import checkApiRequest from "backend/request_utils/checkApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import createEmptyWorkspace from "backend/workspace/createEmptyWorkspace.util";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This is an async function that handles a POST request to create an empty workspace, with various
 * checks for required parameters and error handling.
 * @returns Sends the id of the created workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections = undefined } = await checkApiRequest(req);
    const url = getBodyStringParam(req.body, "url");
    const title = getBodyStringParam(req.body, "title");
    const description = getBodyStringParam(req.body, "description", false);
    const workspaceId = await createEmptyWorkspace(uid, url, title, description, testCollections);
    res.status(201).send(workspaceId);
  } catch (err: any) {
    handleApiError(err, res);
  }
}
