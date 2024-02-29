import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserNotSignedInError from "__tests__/utils/commonTests/clientErrors/testUserNotSignedInError.util";
import signOut from "client/api/user/signOut.api";

describe("Test errors of signing out the current user.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user is not signed in.", async () => {
    await testUserNotSignedInError(() => signOut());
  });
});
