import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import ApiError from "common/types/apiError.class";
import { doc, getDoc } from "firebase/firestore";
import { firstValueFrom } from "rxjs";

/**
 * @throws {string} When the user is not signed in, the user document is not found
 * or the workspace with given url already exists.
 */
export default async function createEmptyWorkspace(
  url: string,
  title: string,
  description: string
): Promise<string> {
  if (!auth.currentUser) throw new Error("User is not signed in.");
  const userDoc = await firstValueFrom(listenCurrentUser());
  if (!userDoc) throw new Error("User document not found.");
  const sameUrlSnap = await getDoc(doc(collections.workspaceUrls, url));
  if (sameUrlSnap.exists()) throw new Error("Workspace with url " + url + " already exists.");
  const res = await fetchApi(API_URLS.workspace.createEmptyWorkspace, { url, title, description });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const workspaceId = res.text();
  return workspaceId;
}
