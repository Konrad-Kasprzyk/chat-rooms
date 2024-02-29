import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import addBotToWorkspace from "backend/workspace/addBotToWorkspace.service";
import { NextRequest } from "next/server";

/**
 * This function handles a request to add a bot to the workspace.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    const botId = getBodyStringParam(body, "botId");
    await addBotToWorkspace(uid, workspaceId, botId, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
