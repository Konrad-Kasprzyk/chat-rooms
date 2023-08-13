import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";

export default async function changeWorkspaceDescription(
  workspaceId: string,
  newDescription: string
): Promise<void> {
  const res = await fetchApi(API_URLS.workspace.changeWorkspaceDescription, {
    workspaceId,
    newDescription,
  });
  if (!res.ok) throw await res.text();
}
