import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../db/firebase-admin";
import { createEmptyWorkspace } from "../../global/utils/admin_utils/workspace";
import MessageWithCode from "../../global/types/messageWithCode";

/**
 * This is an async function that handles a POST request to create an empty workspace, with various
 * checks for required parameters and error handling.
 * @returns Sends the id of the created workspace.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed.");
  }
  if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json") {
    return res.status(415).send("Content-type must be set to application/json");
  }
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
    return res.status(400).send("Body is not object or is empty.");
  const { idToken = "", url = "", title = "", description = "" } = { ...req.body };
  if (!idToken || typeof idToken !== "string") return res.status(401).send("idToken missing.");
  if (!url || typeof url !== "string") return res.status(400).send("Workspace URL missing.");
  if (!title || typeof title !== "string") return res.status(400).send("Workspace title missing.");
  if (typeof description !== "string")
    return res.status(400).send("Workspace description is not a string.");

  const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
    return null;
  });
  if (!decodedToken) return res.status(403).send("Invalid idToken.");
  const uid = decodedToken.uid;

  return createEmptyWorkspace(uid, url, title, description)
    .then((workspaceId) => {
      res.status(201).send(workspaceId);
    })
    .catch((e) => {
      if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
      else if (e instanceof Error) res.status(400).send(e.message);
      else res.status(400).send(e);
    });
}
