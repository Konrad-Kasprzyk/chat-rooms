import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import { filter, firstValueFrom } from "rxjs";

/**
 * Tests if the client function throws the appropriate error.
 * Creates the test user for this single test.
 * @param testFunction Client function to test if it throws the appropriate error.
 */
export default async function testUserDetailsDocumentNotFoundError(testFunction: Function) {
  expect.assertions(1);
  const registeredOnlyUser = registerTestUsers(1)[0];
  await signInTestUser(registeredOnlyUser.uid);
  /**
   * If the user's document is not found or is marked as deleted,
   * a temporary document with data from the firebase account is sent.
   * However, if the user details document is not found or is marked as deleted, then null is sent.
   */
  await firstValueFrom(
    listenCurrentUser().pipe(filter((user) => user?.id == registeredOnlyUser.uid))
  );

  await expect(testFunction).rejects.toThrow("The user details document not found.");
}
