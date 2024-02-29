import changeUserUsername from "backend/user/changeUserUsername.service";
import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import { NextRequest } from "next/server";

/**
 * This is an async function that handles a request to change a user's username and returns a response
 * with a status code of 200 if successful.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, testCollections = undefined } = await checkUserApiRequest(request);
    const newUsername = getBodyStringParam(body, "newUsername");
    await changeUserUsername(uid, newUsername, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
