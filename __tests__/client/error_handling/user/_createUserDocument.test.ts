import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import _createUserDocument from "client_api/user/signIn/_createUserDocument.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of creating a user document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user is not signed in.", async () => {
    expect.assertions(1);

    await expect(_createUserDocument("foo")).rejects.toThrow("The user is not signed in.");
  });

  it("The user document already exists.", async () => {
    expect.assertions(1);
    const user = registerTestUsers(1)[0];
    await signInTestUser(user.uid);

    await _createUserDocument("foo");
    await firstValueFrom(listenCurrentUser().pipe(filter((u) => u?.id == user.uid)));

    await expect(_createUserDocument("foo")).rejects.toThrow("The user document already exists.");
  });
});
