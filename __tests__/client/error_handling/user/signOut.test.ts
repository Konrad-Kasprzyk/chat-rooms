import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import signOut from "client_api/user/signOut.api";

describe("Test errors of signing out the current user.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user is not signed in.", async () => {
    expect.assertions(1);

    await expect(signOut()).rejects.toThrow("The user is not signed in.");
  });
});
