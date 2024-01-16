import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import fetchTestApi from "__tests__/utils/fetchTestApi.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";

describe("Test errors of deleting a user.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user document not found.", async () => {
    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId: "foo",
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("The user document with id foo not found.");
  });

  it("The user does not have the deleted flag set.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);

    const res = await fetchTestApi(SCRIPT_API_URLS.user.deleteUser, {
      userId: testUserId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with id ${testUserId} does not have the deleted flag set.`
    );
  });
});
