import { adminAuth } from "db/firebase-admin";
import COLLECTIONS from "global/constants/collections";
import Collections from "global/types/collections";
import MessageWithCode from "global/types/messageWithCode";
import type { NextApiRequest } from "next";
import getTestCollections from "../test_utils/getTestCollections";

export default async function checkPostRequest(
  req: NextApiRequest
): Promise<{ uid: string; email: string; testCollections?: Collections }> {
  if (req.method !== "POST") throw new MessageWithCode(405, "Only POST requests allowed.");
  if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json")
    throw new MessageWithCode(415, "Content-type must be set to application/json.");
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
    throw new MessageWithCode(400, "Body is not an object or is empty.");
  const idToken = req.body.idToken;
  // User normally authenticated
  if (idToken) {
    if (typeof idToken !== "string" || !idToken)
      throw new MessageWithCode(400, "idToken is not a non-empty string.");
    const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
      return null;
    });
    if (!decodedToken) throw new MessageWithCode(403, "Invalid idToken.");
    if (!decodedToken.email)
      throw new MessageWithCode(403, "User doesn't have an email from decoded token.");
    if (!decodedToken.email_verified)
      throw new MessageWithCode(403, "User doesn't have an email verified from decoded token.");
    return { uid: decodedToken.uid, email: decodedToken.email };
  }
  // Test user authenticating with test private key and providing testCollectionsId
  const {
    uid = undefined,
    email = undefined,
    testCollectionsId = undefined,
    testKey = undefined,
  } = { ...req.body };
  if (!testKey) throw new MessageWithCode(400, "Id token nor test key provided.");
  if (!process.env.TESTS_KEY)
    throw new MessageWithCode(
      500,
      "process.env.TESTS_KEY is undefined. Environment variable should be inside .env file."
    );
  if (testKey !== process.env.TESTS_KEY) throw new MessageWithCode(403, "Invalid testKey.");
  if (
    typeof uid !== "string" ||
    !uid ||
    typeof email !== "string" ||
    !email ||
    typeof testCollectionsId !== "string" ||
    !testCollectionsId
  )
    throw new MessageWithCode(400, "uid, email or testCollectionsId is not a non-empty string");
  return { uid, email, testCollections: getTestCollections(COLLECTIONS, testCollectionsId) };
}
