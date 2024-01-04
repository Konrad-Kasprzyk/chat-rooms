import adminAuth from "backend/db/adminAuth.firebase";
import checkScriptApiRequest from "backend/request_utils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/request_utils/getBodyParam.utils";
import handleApiError from "backend/request_utils/handleApiError.util";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body } = await checkScriptApiRequest(request);
    const userId = getBodyStringParam(body, "userId");
    await adminAuth.deleteUser(userId);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
