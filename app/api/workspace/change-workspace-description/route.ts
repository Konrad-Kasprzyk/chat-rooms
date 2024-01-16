import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/request_utils/getBodyParam.utils";
import changeWorkspaceDescription from "backend/workspace/changeWorkspaceDescription.service";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
    const newDescription = getBodyStringParam(body, "newDescription", false);
    await changeWorkspaceDescription(uid, workspaceId, newDescription, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
