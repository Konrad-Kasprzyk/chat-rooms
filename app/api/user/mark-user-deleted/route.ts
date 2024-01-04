import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import handleApiError from "backend/request_utils/handleApiError.util";
import markUserDeleted from "backend/user/markUserDeleted.service";
import { NextRequest } from "next/server";

/**
 * Handles a request to mark the user deleted.
 */
export async function POST(request: NextRequest) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(request);
    await markUserDeleted(uid, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
