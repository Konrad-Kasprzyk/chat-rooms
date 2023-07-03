import fetchTestPost from "./fetchTestPost";

export async function deleteTestUserAccount(userId: string): Promise<void> {
  const res = await fetchTestPost("api/tests/delete-test-user-account", {
    userId,
  });
  if (!res.ok) throw await res.text();
}
