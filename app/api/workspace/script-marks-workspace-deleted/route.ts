import handleApiError from "backend/utils/handleApiError.util";
import checkScriptApiRequest from "backend/utils/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/utils/request_utils/getBodyParam.utils";
import scriptMarksWorkspaceDeleted from "backend/workspace/scriptMarksWorkspaceDeleted.service";
import { NextRequest } from "next/server";

/**
 * This function handles an API request to mark the workspace deleted
 */
export async function POST(request: NextRequest) {
  try {
    const { body, testCollections = undefined } = await checkScriptApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    await scriptMarksWorkspaceDeleted(workspaceId, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
