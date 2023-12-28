import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";

describe("Test errors of creating a user document.", () => {
  let registeredOnlyUser: {
    uid: string;
    email: string;
    displayName: string;
  };

  beforeAll(async () => {
    await globalBeforeAll();
    registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);
  }, BEFORE_ALL_TIMEOUT);

  it("Uid is not a non-empty string.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocument, {
      uid: "",
      email: registeredOnlyUser.email,
      username: registeredOnlyUser.displayName,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual("The user id is required to be a non-empty string.");
  });

  it("Email is not a non-empty string.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocument, {
      uid: registeredOnlyUser.uid,
      email: "",
      username: registeredOnlyUser.displayName,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual("The email is required to be a non-empty string.");
  });
});
