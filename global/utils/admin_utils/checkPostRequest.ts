import type { NextApiRequest } from "next";
import { adminAuth } from "../../../db/firebase-admin";
import COLLECTIONS from "../../constants/collections";
import Collections from "../../types/collections";
import MessageWithCode from "../../types/messageWithCode";
import getTestSubcollections from "../test_utils/getTestSubcollections";

export default async function checkPostRequest(
  req: NextApiRequest
): Promise<{ uid: string; collections: Collections | undefined }>;

export default async function checkPostRequest<T extends true>(
  req: NextApiRequest,
  verifyIdToken: T
): Promise<{ uid: string; collections: Collections | undefined }>;

export default async function checkPostRequest<T extends false>(
  req: NextApiRequest,
  verifyIdToken: T
): Promise<{ uid: undefined; collections: Collections | undefined }>;

export default async function checkPostRequest<T extends true>(
  req: NextApiRequest,
  verifyIdToken: T,
  checkTestCollectionsId: boolean
): Promise<{ uid: string; collections: Collections | undefined }>;

export default async function checkPostRequest<T extends false>(
  req: NextApiRequest,
  verifyIdToken: T,
  checkTestCollectionsId: boolean
): Promise<{ uid: undefined; collections: Collections | undefined }>;

export default async function checkPostRequest(
  req: NextApiRequest,
  verifyIdToken: boolean = true,
  checkTestCollectionsId: boolean = true
): Promise<{ uid: string | undefined; collections: Collections | undefined }> {
  if (req.method !== "POST") throw new MessageWithCode(405, "Only POST requests allowed.");
  if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json")
    throw new MessageWithCode(415, "Content-type must be set to application/json.");
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
    throw new MessageWithCode(400, "Body is not object or is empty.");
  let uid: string | undefined = undefined;
  if (verifyIdToken) {
    const { idToken = undefined } = { ...req.body };
    if (!idToken) throw new MessageWithCode(401, "idToken missing.");
    if (typeof idToken !== "string") throw new MessageWithCode(403, "Invalid idToken.");
    const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
      return null;
    });
    if (!decodedToken) throw new MessageWithCode(403, "Invalid idToken.");
    uid = decodedToken.uid;
  }
  let collections: Collections | undefined = undefined;
  if (checkTestCollectionsId) {
    const { testCollectionsId = undefined } = { ...req.body };
    if (typeof testCollectionsId !== "undefined" && typeof testCollectionsId !== "string")
      throw new MessageWithCode(
        400,
        "Test collections id is defined, but is not a non-empty string."
      );
    collections = testCollectionsId
      ? getTestSubcollections(COLLECTIONS, testCollectionsId)
      : undefined;
  }
  return { uid, collections };
}
