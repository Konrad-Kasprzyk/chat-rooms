import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import markWorkspaceDeleted from "backend/workspace/markWorkspaceDeleted.service";
import { NextRequest } from "next/server";

/**
 * This function handles an API request to mark the workspace deleted
 */
export async function POST(request: NextRequest) {
  try {
    const { body, testCollections = undefined } = await checkScriptApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    await markWorkspaceDeleted(workspaceId, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
