import fetchTestPost from "common/test_utils/fetchTestPost";

export async function deleteTestCollections(testsId: string): Promise<void> {
  const res = await fetchTestPost("api/tests/delete-test-collections", {
    testsId,
  });
  if (!res.ok) throw await res.text();
}
