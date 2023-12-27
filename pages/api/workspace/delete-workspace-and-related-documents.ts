import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyNumberParam, getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import deleteWorkspaceAndRelatedDocuments from "backend/workspace/deleteWorkspaceAndRelatedDocuments.service";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This function handles an API request to delete the workspace with related documents.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  let maxOperationsPerBatch: number | undefined = undefined;
  try {
    maxOperationsPerBatch = getBodyNumberParam(req.body, "maxDocumentDeletesPerBatch");
  } catch (err: any) {}

  try {
    const { testCollections = undefined } = checkScriptApiRequest(req);
    const workspaceId = getBodyStringParam(req.body, "workspaceId");
    await deleteWorkspaceAndRelatedDocuments(workspaceId, testCollections, maxOperationsPerBatch);
    res.status(200).end();
  } catch (err: any) {
    handleApiError(err, res);
  }
}
