import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyIntegerParam, getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import deleteUser from "backend/user/deleteUser.service";
import ApiError from "common/types/apiError.class";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body, testCollections = undefined } = await checkScriptApiRequest(request);
    const userId = getBodyStringParam(body, "userId");
    // For testing purposes. Can only be used if the api private key is found in the body.
    let maxOperationsPerBatch: number | undefined = undefined;
    try {
      maxOperationsPerBatch = getBodyIntegerParam(body, "maxDocumentDeletesPerBatch");
    } catch (err: any) {}
    if (maxOperationsPerBatch) {
      if (body.privateApiKey !== process.env.API_PRIVATE_KEY)
        throw new ApiError(
          403,
          "Invalid api private key when sending max operations per batch in request body."
        );
    }
    await deleteUser(userId, testCollections, maxOperationsPerBatch);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
