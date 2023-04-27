import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../db/firebase-admin";
import createUserModel from "../../global/utils/admin_utils/createUserModel";
import MessageWithCode from "../../global/types/messageWithCode";

/**
 * This is an async function that handles a POST request, validates the request body, verifies an
 * idToken, and creates a user model.
 * @returns Sends the id of the created user document.
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
  const { email = "", username = "", idToken = "" } = { ...req.body };
  if (!email || typeof email !== "string") return res.status(400).send("Email missing.");
  if (typeof username !== "string") return res.status(400).send("Username is not a string.");
  if (!idToken || typeof idToken !== "string") return res.status(401).send("idToken missing.");

  const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
    return null;
  });
  if (!decodedToken) return res.status(403).send("Invalid idToken.");
  const uid = decodedToken.uid;

  return createUserModel(uid, email, username)
    .then((userModelId) => {
      res.status(201).send(userModelId);
    })
    .catch((e) => {
      if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
      else if (e instanceof Error) res.status(400).send(e.message);
      else res.status(400).send(e);
    });
}
