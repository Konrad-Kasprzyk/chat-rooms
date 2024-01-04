import checkUserApiRequest from "backend/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import cancelUserInvitationToWorkspace from "backend/workspace/cancelUserInvitationToWorkspace.service";
import { NextRequest } from "next/server";

/**
 * This function handles a request to cancel a user invitation to a workspace.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    const targetUserEmail = getBodyStringParam(body, "targetUserEmail");
    await cancelUserInvitationToWorkspace(uid, workspaceId, targetUserEmail, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
