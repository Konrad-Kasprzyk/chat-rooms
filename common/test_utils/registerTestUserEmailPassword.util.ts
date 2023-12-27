import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";
import ApiError from "common/types/apiError.class";
import fetchTestApi from "./fetchTestApi.util";

export async function registerTestUserEmailPassword(
  email: string,
  password: string,
  displayName: string
): Promise<string> {
  const res = await fetchTestApi(SCRIPT_API_URLS.tests.registerUserEmailPassword, {
    email,
    password,
    displayName,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.text();
}
