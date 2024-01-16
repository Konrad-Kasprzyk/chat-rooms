import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testOpenWorkspaceNotFoundError from "__tests__/utils/commonTests/clientErrors/testOpenWorkspaceNotFoundError.util";
import changeWorkspaceTitle from "client_api/workspace/changeWorkspaceTitle.api";

describe("Test errors of changing a workspace title.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The provided new title is an empty string.", async () => {
    expect.assertions(1);
    await expect(changeWorkspaceTitle("")).rejects.toThrow(
      "The provided new title is an empty string."
    );
  });

  it("The open workspace document not found.", async () => {
    await testOpenWorkspaceNotFoundError(() => changeWorkspaceTitle("foo"));
  });
});
