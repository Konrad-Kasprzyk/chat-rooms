import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";

describe("Test errors of creating user documents.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Uid is not a non-empty string.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocuments, {
      uid: "",
      email: registeredOnlyUser.email,
      username: registeredOnlyUser.displayName,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("The user id is required to be a non-empty string.");
  });

  it("Username is not a non-empty string.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocuments, {
      uid: registeredOnlyUser.uid,
      email: registeredOnlyUser.email,
      username: "",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("username is not a non-empty string.");
  });
});
