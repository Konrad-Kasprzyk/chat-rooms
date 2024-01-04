import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import {
  getBodyStringArrayParam,
  getBodyStringParam,
} from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import removeUsersFromWorkspace from "backend/test_utils/removeUsersFromWorkspace.service";
import ApiError from "common/types/apiError.class";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body, testCollections } = await checkScriptApiRequest(request);
    if (!testCollections) throw new ApiError(400, "Test collections id is not a non-empty string");
    const userIds = getBodyStringArrayParam(body, "userIds");
    const userEmails = getBodyStringArrayParam(body, "userEmails");
    const workspaceId = getBodyStringParam(body, "workspaceId");
    await removeUsersFromWorkspace(userIds, userEmails, workspaceId, testCollections);
    return NextResponse.json(workspaceId, {
      status: 200,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
