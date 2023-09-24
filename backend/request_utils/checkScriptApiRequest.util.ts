import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import createAdminCollections from "backend/db/createAdminCollections.util";
import ApiError from "common/types/apiError.class";
import type { NextApiRequest } from "next";

/**
 * Requires proper POST request and the private api key.
 */
export default function checkScriptApiRequest(req: NextApiRequest): {
  testCollections?: typeof adminCollections;
} {
  if (req.method !== "POST") throw new ApiError(405, "Only POST requests allowed.");
  if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json")
    throw new ApiError(415, "Content-type must be set to application/json.");
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
    throw new ApiError(400, "Body is not an object or is empty.");
  const { testCollectionsId = undefined, privateApiKey = undefined } = { ...req.body };
  if (!privateApiKey) throw new ApiError(403, "Api private key not provided.");
  if (!process.env.API_PRIVATE_KEY)
    throw new ApiError(
      500,
      "process.env.API_PRIVATE_KEY is undefined. Environment variable should be inside .env file."
    );
  if (privateApiKey !== process.env.API_PRIVATE_KEY)
    throw new ApiError(403, "Invalid api private key.");
  let testCollections: typeof adminCollections | undefined = undefined;
  if (testCollectionsId) {
    if (typeof testCollectionsId !== "string")
      throw new ApiError(400, "Test collections id is provided, but is not a non-empty string.");
    testCollections = createAdminCollections(adminDb, testCollectionsId);
  }
  return { testCollections };
}
