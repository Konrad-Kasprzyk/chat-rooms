import fetchTestPost from "common/test_utils/fetchTestPost";
import testCollectionsId from "./testCollectionsId";

export async function createGlobalCounter(): Promise<void> {
  const res = await fetchTestPost("api/tests/create-global-counter", {
    testCollectionsId,
  });
  if (!res.ok) throw await res.text();
}
