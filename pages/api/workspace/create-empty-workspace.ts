import MessageWithCode from "global/types/messageWithCode";
import checkPostRequest from "global/utils/admin_utils/checkPostRequest";
import { createEmptyWorkspace } from "global/utils/admin_utils/workspace";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This is an async function that handles a POST request to create an empty workspace, with various
 * checks for required parameters and error handling.
 * @returns Sends the id of the created workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, testCollections } = await checkPostRequest(req);
    const { url = undefined, title = undefined, description = undefined } = { ...req.body };
    if (!url || typeof url !== "string") return res.status(400).send("Workspace URL missing.");
    if (!title || typeof title !== "string")
      return res.status(400).send("Workspace title missing.");
    if (typeof description !== "string")
      return res.status(400).send("Workspace description is not a string.");
    const workspace = await createEmptyWorkspace(uid, url, title, description, testCollections);
    res.status(201).send(workspace.id);
  } catch (e: any) {
    if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
