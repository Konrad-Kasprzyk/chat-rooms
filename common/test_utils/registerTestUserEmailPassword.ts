import fetchTestPost from "./fetchTestPost";

export async function registerTestUserEmailPassword(
  email: string,
  password: string,
  displayName: string
): Promise<string> {
  const res = await fetchTestPost("api/tests/register-user-email-password", {
    email,
    password,
    displayName,
  });
  if (!res.ok) throw await res.text();
  return res.text();
}
