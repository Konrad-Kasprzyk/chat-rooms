import COLLECTIONS from "common/constants/collections.constant";
import getTestCollections from "common/test_utils/getTestCollections.util";
import ApiError from "common/types/apiError.class";
import Collections from "common/types/collections.type";
import type { NextApiRequest } from "next";

export default function checkTestPostRequest(
  req: NextApiRequest,
  requireTestCollections: false
): void;
export default function checkTestPostRequest(
  req: NextApiRequest,
  requireTestCollections: true
): { testCollections: Collections };
export default function checkTestPostRequest(req: NextApiRequest): { testCollections: Collections };
export default function checkTestPostRequest(
  req: NextApiRequest,
  requireTestCollections: boolean = true
): { testCollections: Collections } | void {
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
    return { testCollections: getTestCollections(COLLECTIONS, testCollectionsId) };
  }
}
