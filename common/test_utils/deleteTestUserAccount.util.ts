import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import ApiError from "common/types/apiError.class";
import fetchTestApi from "./fetchTestApi.util";

export async function deleteTestUserAccount(userId: string): Promise<void> {
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.deleteTestUserAccount, {
    userId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
