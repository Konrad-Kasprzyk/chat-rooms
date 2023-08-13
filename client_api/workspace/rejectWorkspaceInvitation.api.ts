import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";

export default async function rejectWorkspaceInvitation(workspaceId: string): Promise<void> {
  const res = await fetchApi(API_URLS.workspace.rejectWorkspaceInvitation, {
    workspaceId,
  });
  if (!res.ok) throw await res.text();
}
