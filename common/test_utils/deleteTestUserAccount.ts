import API_URLS from "common/constants/apiUrls";
import fetchTestApi from "./fetchTestApi";

export async function deleteTestUserAccount(userId: string): Promise<void> {
  const res = await fetchTestApi(API_URLS.tests.deleteTestUserAccount, {
    userId,
  });
  if (!res.ok) throw await res.text();
}
