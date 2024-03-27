import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import createWorkspace from "backend/workspace/createWorkspace.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * This is an async function that handles a POST request to create a workspace, with various
 * checks for required parameters and error handling.
 * @returns Sends the id of the created workspace.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const title = getBodyStringParam(body, "title");
    const description = getBodyStringParam(body, "description", false);
    const url = getBodyStringParam(body, "url", false);
    const workspaceId = await createWorkspace(uid, title, description, url, testCollections);
    return NextResponse.json(workspaceId, {
      status: 201,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
