import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testOpenWorkspaceNotFoundError from "__tests__/utils/commonTests/clientErrors/testOpenWorkspaceNotFoundError.util";
import sendMessage from "client/api/workspace/sendMessage.api";

describe("Test errors of sending a new message.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The provided message is an empty string.", async () => {
    expect.assertions(1);
    await expect(sendMessage("")).rejects.toThrow("The message to send is an empty string.");
  });

  it("The open workspace document not found.", async () => {
    await testOpenWorkspaceNotFoundError(() => sendMessage("foo"));
  });
});
