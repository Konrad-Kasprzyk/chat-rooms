import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import sendMessage from "backend/workspace/sendMessage.service";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    const message = getBodyStringParam(body, "message");
    await sendMessage(uid, workspaceId, message, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
