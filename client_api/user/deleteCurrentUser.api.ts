import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import auth from "db/client/auth.firebase";
import signOut from "./signOut.api";

export default async function deleteCurrentUser(): Promise<void> {
  if (!auth.currentUser) throw "User is not signed in.";
  const res = await fetchApi(API_URLS.user.deleteUser);
  if (!res.ok) throw await res.text();
  await signOut();
}
