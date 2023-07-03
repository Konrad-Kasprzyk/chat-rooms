import fetchTestPost from "common/test_utils/fetchTestPost";
import testCollectionsId from "./setup/testCollectionsId";

export async function removeUsersFromWorkspace(
  userIds: string[],
  workspaceId: string
): Promise<void> {
  const res = await fetchTestPost("api/tests/remove-users-from-workspace", {
    testCollectionsId,
    userIds,
    workspaceId,
  });
  if (!res.ok) throw await res.text();
}
