import signOut from "client_api/user/signOut.api";
import auth from "common/db/auth.firebase";

export default async function testUserNotSignedInError(testFunction: Function) {
  expect.assertions(1);
  if (auth.currentUser) await signOut();

  await expect(testFunction).rejects.toThrow("The user is not signed in.");
}
