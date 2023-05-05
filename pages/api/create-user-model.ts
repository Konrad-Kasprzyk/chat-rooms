import type { NextApiRequest, NextApiResponse } from "next";
import MessageWithCode from "../../global/types/messageWithCode";
import checkPostRequest from "../../global/utils/admin_utils/checkPostRequest";
import createUserModel from "../../global/utils/admin_utils/createUserModel";

/**
 * This is an async function that handles a POST request, validates the request body, verifies an
 * idToken, and creates a user model.
 * @returns Sends the id of the created user document.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const { uid, collections } = await checkPostRequest(req);
    const { email = undefined, username = undefined } = { ...req.body };
    if (!email || typeof email !== "string") return res.status(400).send("Email missing.");
    if (typeof username !== "string") return res.status(400).send("Username is not a string.");
    const userModelId = await createUserModel(uid, email, username, collections);
    res.status(201).send(userModelId);
  } catch (e: any) {
    if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
    else if (e instanceof Error) res.status(400).send(e.message);
    else res.status(400).send(e);
  }
}
