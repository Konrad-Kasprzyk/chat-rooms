import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserDetailsDocumentNotFoundError from "__tests__/utils/commonTests/clientErrors/testUserDetailsDocumentNotFoundError.util";
import createEmptyWorkspace from "client_api/workspace/createEmptyWorkspace.api";

describe("Test errors of creating an empty workspace.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The provided url is an empty string.", async () => {
    expect.assertions(1);
    await expect(createEmptyWorkspace("", "foo", "foo")).rejects.toThrow(
      "The provided url is an empty string."
    );
  });

  it("The provided title is an empty string.", async () => {
    expect.assertions(1);
    await expect(createEmptyWorkspace("foo", "", "foo")).rejects.toThrow(
      "The provided title is an empty string."
    );
  });

  it("The user details document of the user using the api not found.", async () => {
    await testUserDetailsDocumentNotFoundError(() => createEmptyWorkspace("foo", "foo", "foo"));
  });
});
