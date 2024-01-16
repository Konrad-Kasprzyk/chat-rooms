import rejectWorkspaceInvitation from "backend/user/rejectWorkspaceInvitation.service";
import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/request_utils/getBodyParam.utils";
import { NextRequest } from "next/server";

/**
 * Handles a request to reject a workspace invitation.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    await rejectWorkspaceInvitation(uid, workspaceId, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
