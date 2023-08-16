import ApiError from "common/types/apiError.class";
import adminAuth from "db/admin/adminAuth.firebase";
import adminCollections from "db/admin/adminCollections.firebase";
import adminDb from "db/admin/adminDb.firebase";
import createAdminCollections from "db/admin/createAdminCollections.util";
import type { NextApiRequest } from "next";

export default async function checkApiRequest(
  req: NextApiRequest
): Promise<{ uid: string; email: string; testCollections?: typeof adminCollections }> {
  if (req.method !== "POST") throw new ApiError(405, "Only POST requests allowed.");
  if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json")
    throw new ApiError(415, "Content-type must be set to application/json.");
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
    throw new ApiError(400, "Body is not an object or is empty.");
  const idToken = req.body.idToken;
  // User normally authenticated
  if (idToken) {
    if (typeof idToken !== "string" || !idToken)
      throw new ApiError(400, "idToken is not a non-empty string.");
    const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
      return null;
    });
    if (!decodedToken) throw new ApiError(403, "Invalid idToken.");
    if (!decodedToken.email)
      throw new ApiError(403, "User doesn't have an email from decoded token.");
    if (!decodedToken.email_verified)
      throw new ApiError(403, "User doesn't have an email verified from decoded token.");
    return { uid: decodedToken.uid, email: decodedToken.email };
  }
  // Test user authenticating with test private key and providing testCollectionsId
  const {
    uid = undefined,
    email = undefined,
    testCollectionsId = undefined,
    testKey = undefined,
  } = { ...req.body };
  if (!testKey) throw new ApiError(400, "Id token nor test key provided.");
  if (!process.env.TESTS_KEY)
    throw new ApiError(
      500,
      "process.env.TESTS_KEY is undefined. Environment variable should be inside .env file."
    );
  if (testKey !== process.env.TESTS_KEY) throw new ApiError(403, "Invalid testKey.");
  if (
    typeof uid !== "string" ||
    !uid ||
    typeof email !== "string" ||
    !email ||
    typeof testCollectionsId !== "string" ||
    !testCollectionsId
  )
    throw new ApiError(400, "uid, email or testCollectionsId is not a non-empty string");
  return { uid, email, testCollections: createAdminCollections(adminDb, testCollectionsId) };
}
