import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import createAdminCollections from "backend/db/createAdminCollections.util";
import ApiError from "common/types/apiError.class";
import { NextRequest } from "next/server";

/**
 * Requires proper POST request and the private api key.
 */
export default async function checkScriptApiRequest(req: NextRequest): Promise<{
  body: { [key: string]: any };
  testCollections?: typeof adminCollections;
}> {
  if (req.method !== "POST") throw new ApiError(405, "Only POST requests allowed.");
  if (req.headers.get("content-type") !== "application/json")
    throw new ApiError(415, "Content-type must be set to application/json.");
  let body: any;
  try {
    body = await req.json();
  } catch (err: any) {
    throw new ApiError(400, "Parsing the body text as JSON error.");
  }
  if (!body || typeof body !== "object" || Object.keys(body).length === 0)
    throw new ApiError(400, "Body is not an object or is empty.");
  const { testCollectionsId = undefined, privateApiKey = undefined } = { ...body };
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
  return { body, testCollections };
}
