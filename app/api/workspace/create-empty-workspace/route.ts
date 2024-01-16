import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/request_utils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/request_utils/getBodyParam.utils";
import createEmptyWorkspace from "backend/workspace/createEmptyWorkspace.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * This is an async function that handles a POST request to create an empty workspace, with various
 * checks for required parameters and error handling.
 * @returns Sends the id of the created workspace.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const url = getBodyStringParam(body, "url");
    const title = getBodyStringParam(body, "title");
    const description = getBodyStringParam(body, "description", false);
    const workspaceId = await createEmptyWorkspace(uid, url, title, description, testCollections);
    return NextResponse.json(workspaceId, {
      status: 201,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
