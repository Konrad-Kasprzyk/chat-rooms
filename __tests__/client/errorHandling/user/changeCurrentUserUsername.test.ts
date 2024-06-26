import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserDetailsDocumentNotFoundError from "__tests__/utils/commonTests/clientErrors/testUserDetailsDocumentNotFoundError.util";
import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";

describe("Test errors of changing the current user username.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The username is an empty string.", async () => {
    expect.assertions(1);

    await expect(changeCurrentUserUsername("")).rejects.toThrow(
      "The username is required to be a non-empty string."
    );
  });

  it("The user details document of the user using the api not found.", async () => {
    await testUserDetailsDocumentNotFoundError(() => changeCurrentUserUsername("foo"));
  });
});
