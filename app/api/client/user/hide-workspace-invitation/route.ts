import hideWorkspaceInvitation from "backend/user/hideWorkspaceInvitation.service";
import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import { NextRequest } from "next/server";

/**
 * Handles a request to hide a workspace invitation for a user.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    await hideWorkspaceInvitation(uid, workspaceId, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
