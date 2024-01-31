import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import removeUserFromWorkspace from "backend/workspace/removeUserFromWorkspace.service";
import { NextRequest } from "next/server";

/**
 * This function handles an API request to remove a user from a workspace.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    const userIdToRemove = getBodyStringParam(body, "userIdToRemove");
    await removeUserFromWorkspace(uid, workspaceId, userIdToRemove, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
