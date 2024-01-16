import adminAuth from "backend/db/adminAuth.firebase";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import createAdminCollections from "backend/db/createAdminCollections.util";
import ApiError from "common/types/apiError.class";
import { NextRequest } from "next/server";

/**
 * Requires proper POST request and the user to authenticate with the id token from the firebase
 * or the api private key.
 */
export default async function checkUserApiRequest(
  req: NextRequest
): Promise<{
  body: { [key: string]: any };
  uid: string;
  email: string;
  testCollections?: typeof adminCollections;
}> {
  if (req.method !== "POST") throw new ApiError(405, "Only POST requests allowed.");
  if (req.headers.get("content-type") !== "application/json")
    throw new ApiError(415, "Content-type must be set to application/json.");
  const body = await req.json();
  if (!body || typeof body !== "object" || Object.keys(body).length === 0)
    throw new ApiError(400, "Body is not an object or is empty.");
  const idToken = body.idToken;
  if (idToken) {
    if (!idToken || typeof idToken !== "string")
      throw new ApiError(403, "Id token is not a non-empty string.");
    const decodedToken = await adminAuth.verifyIdToken(idToken).catch(() => {
      return null;
    });
    if (!decodedToken) throw new ApiError(403, "Invalid id token.");
    if (!decodedToken.email)
      throw new ApiError(403, "User doesn't have an email from the decoded token.");
    if (!decodedToken.email_verified)
      throw new ApiError(403, "User doesn't have an email verified from the decoded token.");
    return { body, uid: decodedToken.uid, email: decodedToken.email };
  }
  // Test user authenticate with the private api key.
  // Test user must provide uid, email and the test collections id.
  const {
    uid = undefined,
    email = undefined,
    testCollectionsId = undefined,
    privateApiKey = undefined,
  } = { ...body };
  if (!privateApiKey) throw new ApiError(403, "Neither id token nor api private key provided.");
  if (!process.env.API_PRIVATE_KEY)
    throw new ApiError(
      500,
      "process.env.API_PRIVATE_KEY is undefined. Environment variable should be inside .env file."
    );
  if (privateApiKey !== process.env.API_PRIVATE_KEY)
    throw new ApiError(403, "Invalid api private key.");
  if (!testCollectionsId)
    throw new ApiError(
      400,
      "The test user authenticated with the private api key did not provide a test collections id."
    );
  if (typeof testCollectionsId !== "string")
    throw new ApiError(400, "Test collections id is provided, but is not a non-empty string.");
  const testCollections = createAdminCollections(adminDb, testCollectionsId);
  if (!uid || typeof uid !== "string")
    throw new ApiError(400, "The user id is required to be a non-empty string.");
  if (!email || typeof email !== "string")
    throw new ApiError(400, "The email is required to be a non-empty string.");
  return { body, uid, email, testCollections };
}
