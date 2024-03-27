import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserNotSignedInError from "__tests__/utils/commonTests/clientErrors/testUserNotSignedInError.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import _createUserDocuments from "client/api/user/signIn/_createUserDocuments.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of creating user documents.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The username is an empty string.", async () => {
    expect.assertions(1);

    await expect(_createUserDocuments("")).rejects.toThrow(
      "The username is required to be a non-empty string."
    );
  });

  it("The user is not signed in.", async () => {
    await testUserNotSignedInError(() => _createUserDocuments("foo"));
  });

  it("The user document already exists.", async () => {
    expect.assertions(1);
    const user = registerTestUsers(1)[0];
    await signInTestUser(user.uid);

    await _createUserDocuments("foo");
    await firstValueFrom(listenCurrentUserDetails().pipe(filter((u) => u?.id == user.uid)));

    await expect(_createUserDocuments("foo")).rejects.toThrow("The user document already exists.");
  });
});
