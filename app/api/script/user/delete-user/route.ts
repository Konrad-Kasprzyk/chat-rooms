import deleteUser from "backend/user/deleteUser.service";
import handleApiError from "backend/utils/handleApiError.util";
import checkScriptApiRequest from "backend/utils/requestUtils/checkScriptApiRequest.util";
import {
  getBodyIntegerParam,
  getBodyStringParam,
} from "backend/utils/requestUtils/getBodyParam.utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body, testCollections = undefined } = await checkScriptApiRequest(request);
    // For testing purposes.
    let maxOperationsPerBatch: number | undefined = undefined;
    // If the given property is not found in the body, an error is thrown.
    try {
      maxOperationsPerBatch = getBodyIntegerParam(body, "maxDocumentDeletesPerBatch");
    } catch (err: any) {}
    const userId = getBodyStringParam(body, "userId");
    await deleteUser(userId, testCollections, maxOperationsPerBatch);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
