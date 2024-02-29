import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testUserHasDeletedFlagError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";

describe("Test errors of changing a user username.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Username is not a non-empty string.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.user.changeUserUsername, {
      newUsername: "",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("newUsername is not a non-empty string.");
  });

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.user.changeUserUsername, {
      newUsername: "foo",
    });
  });

  it("The user using the api has the deleted flag set.", async () => {
    await testUserHasDeletedFlagError(CLIENT_API_URLS.user.changeUserUsername, {
      newUsername: "foo",
    });
  });

  it("The user details document not found.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.userDetails.doc(testUserId).delete();

    const res = await fetchApi(CLIENT_API_URLS.user.changeUserUsername, {
      newUsername: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `The user details document with id ${testUserId} not found, but found the user document.`
    );
  });
});
