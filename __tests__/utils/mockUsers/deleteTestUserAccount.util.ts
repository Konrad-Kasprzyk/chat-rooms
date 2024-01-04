import handleApiResponse from "client_api/utils/handleApiResponse.util";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import fetchTestApi from "../fetchTestApi.util";

export async function deleteTestUserAccount(userId: string): Promise<void> {
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.deleteTestUserAccount, {
    userId,
  });
  await handleApiResponse(res);
}
