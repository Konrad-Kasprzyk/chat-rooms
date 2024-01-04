import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import moveWorkspaceToRecycleBin from "backend/workspace/moveWorkspaceToRecycleBin.service";
import { NextRequest } from "next/server";

/**
 * This function handles an API request to move the workspace to the recycle bin.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    await moveWorkspaceToRecycleBin(uid, workspaceId, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
