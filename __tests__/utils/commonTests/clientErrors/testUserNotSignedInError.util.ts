import auth from "clientApi/db/auth.firebase";
import signOut from "clientApi/user/signOut.api";

export default async function testUserNotSignedInError(testFunction: Function) {
  expect.assertions(1);
  if (auth.currentUser) await signOut();

  await expect(testFunction).rejects.toThrow("The user is not signed in.");
}
