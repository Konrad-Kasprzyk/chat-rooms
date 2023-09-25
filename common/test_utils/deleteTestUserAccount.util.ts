import API_URLS from "common/constants/apiUrls.constant";
import ApiError from "common/types/apiError.class";
import fetchTestApi from "./fetchTestApi.util";

export async function deleteTestUserAccount(userId: string): Promise<void> {
  const res = await fetchTestApi(API_URLS.tests.deleteTestUserAccount, {
    userId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
