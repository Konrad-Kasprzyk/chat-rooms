import fetchApi from "client_api/utils/fetchApi.util";
import API_URLS from "common/constants/apiUrls.constant";
import ApiError from "common/types/apiError.class";

export default async function cancelUserInvitationToWorkspace(
  workspaceId: string,
  userId: string
): Promise<void> {
  const res = await fetchApi(API_URLS.workspace.cancelUserInvitationToWorkspace, {
    workspaceId,
    userId,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
