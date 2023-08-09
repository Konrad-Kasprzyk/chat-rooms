import ApiError from "common/types/apiError.class";
import createAdminCollections from "db/admin/createAdminCollections.util";
import { AdminCollections, adminDb } from "db/admin/firebase-admin";
import type { NextApiRequest } from "next";

export default function checkTestApiRequest(
  req: NextApiRequest,
  requireTestCollections: false
): void;
export default function checkTestApiRequest(
  req: NextApiRequest,
  requireTestCollections: true
): { testCollections: typeof AdminCollections };
export default function checkTestApiRequest(req: NextApiRequest): {
  testCollections: typeof AdminCollections;
};
export default function checkTestApiRequest(
  req: NextApiRequest,
  requireTestCollections: boolean = true
): { testCollections: typeof AdminCollections } | void {
  if (req.method !== "POST") throw new ApiError(405, "Only POST requests allowed.");
  if (!req.headers["content-type"] || req.headers["content-type"] !== "application/json")
    throw new ApiError(415, "Content-type must be set to application/json.");
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
    throw new ApiError(400, "Body is not an object or is empty.");
  // Test user authenticating with test private key
  const testKey = req.body.testKey;
  if (!testKey) throw new ApiError(400, "Test key not provided.");
  if (!process.env.TESTS_KEY)
    throw new ApiError(
      500,
      "process.env.TESTS_KEY is undefined. Environment variable should be inside .env file."
    );
  if (testKey !== process.env.TESTS_KEY) throw new ApiError(403, "Invalid testKey.");
  if (requireTestCollections) {
    const testCollectionsId = req.body.testCollectionsId;
    if (typeof testCollectionsId !== "string" || !testCollectionsId)
      throw new ApiError(400, "testCollectionsId is not a non-empty string");
    return { testCollections: createAdminCollections(adminDb, testCollectionsId) };
  }
}
