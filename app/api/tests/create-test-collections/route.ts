import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import createTestCollections from "backend/test_utils/createTestCollections.service";
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
