import fetchTestPost from "common/test_utils/fetchTestPost";
import testCollectionsId from "./setup/testCollectionsId";

export async function deleteTestUserDocument(userId: string): Promise<void> {
  const res = await fetchTestPost("api/tests/delete-test-user-document", {
    testCollectionsId,
    userId,
  });
  if (!res.ok) throw await res.text();
}
