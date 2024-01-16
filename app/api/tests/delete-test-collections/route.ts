import handleApiError from "backend/utils/handleApiError.util";
import checkScriptApiRequest from "backend/utils/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/utils/request_utils/getBodyParam.utils";
import deleteTestCollections from "backend/utils/test_utils/deleteTestCollections.service";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body } = await checkScriptApiRequest(request);
    const testsId = getBodyStringParam(body, "testsId");
    await deleteTestCollections(testsId);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
