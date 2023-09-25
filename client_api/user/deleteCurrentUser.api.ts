import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import auth from "common/db/auth.firebase";
import ApiError from "common/types/apiError.class";
import signOut from "./signOut.api";

export default async function deleteCurrentUser(): Promise<void> {
  if (!auth.currentUser) throw new Error("User is not signed in.");
  const res = await fetchApi(API_URLS.user.deleteUser);
  if (!res.ok) throw new ApiError(res.status, await res.text());
  await signOut();
}
