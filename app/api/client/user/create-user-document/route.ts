import createUserDocument from "backend/user/createUserDocument.service";
import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * This is an async function that handles a POST request, validates the request body, verifies an
 * idToken, and creates a user model.
 * @returns Sends the id of the created user document.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, uid, email, testCollections = undefined } = await checkUserApiRequest(request);
    const username = getBodyStringParam(body, "username");
    const createdUserDocId = await createUserDocument(uid, username, email, testCollections);
    return NextResponse.json(createdUserDocId, {
      status: 201,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
