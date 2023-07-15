import API_URLS from "common/constants/apiUrls.constant";
import fetchTestApi from "./fetchTestApi.util";

export async function registerTestUserEmailPassword(
  email: string,
  password: string,
  displayName: string
): Promise<string> {
  const res = await fetchTestApi(API_URLS.tests.registerUserEmailPassword, {
    email,
    password,
    displayName,
  });
  if (!res.ok) throw await res.text();
  return res.text();
}