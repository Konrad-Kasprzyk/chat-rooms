import handleApiError from "backend/utils/handleApiError.util";
import checkScriptApiRequest from "backend/utils/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/utils/request_utils/getBodyParam.utils";
import createTestCollections from "backend/utils/test_utils/createTestCollections.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body } = await checkScriptApiRequest(request);
    const testCollectionsId = getBodyStringParam(body, "testCollectionsId");
    const testsId = getBodyStringParam(body, "testsId");
    await createTestCollections(testCollectionsId, testsId);
    return NextResponse.json(testCollectionsId, {
      status: 201,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
