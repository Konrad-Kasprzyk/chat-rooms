import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserNotSignedInError from "__tests__/utils/commonTests/clientErrors/testUserNotSignedInError.util";
import deleteUserDocumentsAndAccount from "client/api/user/deleteUserDocumentsAndAccount.api";

describe("Test errors of deleting user documents.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user is not signed in.", async () => {
    await testUserNotSignedInError(() => deleteUserDocumentsAndAccount());
  });
});
