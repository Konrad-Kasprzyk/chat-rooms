import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../db/firebase-admin";
import createUserModel from "../../global/admin_utils/createUserModel";
import MessageWithCode from "../../global/types/messageWithCode";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed.");
  }
  if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json") {
    return res.status(415).send("Content-type must be set to application/json");
  }
  const { email = "", username = "", idToken = "" } = { ...req.body };
  if (!email || typeof email !== "string") return res.status(400).send("Email missing.");
  if (!username || typeof username !== "string") return res.status(400).send("Username missing.");
  if (!idToken || typeof idToken !== "string") return res.status(401).send("idToken missing.");

  const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
    return null;
  });
  if (!decodedToken) return res.status(403).send("Invalid idToken.");
  const uid = decodedToken.uid;

  return createUserModel(uid, email, username)
    .then((messageWithCode) => {
      res.status(messageWithCode.code).send(messageWithCode.message);
    })
    .catch((e) => {
      if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
      else if (e instanceof Error) res.status(400).send(e.message);
      else res.status(400).send(e);
    });
}
