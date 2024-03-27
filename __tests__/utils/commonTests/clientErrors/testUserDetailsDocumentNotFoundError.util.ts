import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";

/**
 * Tests if the client function throws the appropriate error.
 * Creates the test user for this single test.
 * @param testFunction Client function to test if it throws the appropriate error.
 */
export default async function testUserDetailsDocumentNotFoundError(testFunction: Function) {
  expect.assertions(1);
  const registeredOnlyUser = registerTestUsers(1)[0];
  await signInTestUser(registeredOnlyUser.uid);

  await expect(testFunction).rejects.toThrow("The user details document not found.");
}
