import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../db/firebase-admin";
import COLLECTIONS from "../../global/constants/collections";
import MessageWithCode from "../../global/types/messageWithCode";
import { deleteWorkspaceAndRelatedDocuments } from "../../global/utils/admin_utils/workspace";
import getTestSubcollections from "../../global/utils/test_utils/getTestSubcollections";

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
  const {
    idToken = undefined,
    workspaceId = undefined,
    testCollectionsId = undefined,
  } = { ...req.body };
  if (!idToken || typeof idToken !== "string") return res.status(401).send("idToken missing.");
  if (!workspaceId || typeof workspaceId !== "string")
    return res.status(400).send("Workspace id missing.");
  if (testCollectionsId && typeof testCollectionsId !== "string")
    return res.status(400).send("Test collections id is defined, but is not a non-empty string.");

  const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
    return null;
  });
  if (!decodedToken) return res.status(403).send("Invalid idToken.");
  const uid = decodedToken.uid;

  return deleteWorkspaceAndRelatedDocuments(
    uid,
    workspaceId,
    undefined,
    testCollectionsId ? getTestSubcollections(COLLECTIONS, testCollectionsId) : undefined
  )
    .then(() => {
      res.status(201).send(workspaceId);
    })
    .catch((e: any) => {
      if (e instanceof MessageWithCode) res.status(e.code).send(e.message);
      else if (e instanceof Error) res.status(400).send(e.message);
      else res.status(400).send(e);
    });
}
