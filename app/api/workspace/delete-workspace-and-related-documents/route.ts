import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyIntegerParam, getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import deleteWorkspaceAndRelatedDocuments from "backend/workspace/deleteWorkspaceAndRelatedDocuments.service";
import ApiError from "common/types/apiError.class";
import { NextRequest } from "next/server";

/**
 * This function handles an API request to delete the workspace with related documents.
 */
export async function POST(request: NextRequest) {
  try {
    const { body, testCollections = undefined } = await checkScriptApiRequest(request);
    const workspaceId = getBodyStringParam(body, "workspaceId");
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
    await deleteWorkspaceAndRelatedDocuments(workspaceId, testCollections, maxOperationsPerBatch);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
