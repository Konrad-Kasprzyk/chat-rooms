import deleteUser from "backend/user/deleteUser.service";
import handleApiError from "backend/utils/handleApiError.util";
import checkScriptApiRequest from "backend/utils/requestUtils/checkScriptApiRequest.util";
import { getBodyStringParam } from "backend/utils/requestUtils/getBodyParam.utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { body, testCollections = undefined } = await checkScriptApiRequest(request);
    const userId = getBodyStringParam(body, "userId");
    await deleteUser(userId, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
