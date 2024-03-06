import deleteUserDocumentsAndAccount from "backend/user/deleteUserDocumentsAndAccount.service";
import handleApiError from "backend/utils/handleApiError.util";
import checkUserApiRequest from "backend/utils/requestUtils/checkUserApiRequest.util";
import { NextRequest } from "next/server";

/**
 * Handles a request to delete user documents.
 */
export async function POST(request: NextRequest) {
  try {
    const { uid, testCollections = undefined } = await checkUserApiRequest(request);
    await deleteUserDocumentsAndAccount(uid, testCollections);
    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return handleApiError(err);
  }
}
