import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserNotSignedInError from "__tests__/utils/commonTests/clientErrors/testUserNotSignedInError.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import _createUserDocument from "client_api/user/signIn/_createUserDocument.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of creating a user document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user is not signed in.", async () => {
    await testUserNotSignedInError(() => _createUserDocument("foo"));
  });

  it("The user document already exists.", async () => {
    expect.assertions(1);
    const user = registerTestUsers(1)[0];
    await signInTestUser(user.uid);

    await _createUserDocument("foo");
    await firstValueFrom(listenCurrentUserDetails().pipe(filter((u) => u?.id == user.uid)));

    await expect(_createUserDocument("foo")).rejects.toThrow("The user document already exists.");
  });
});
