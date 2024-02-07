import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testOpenWorkspaceNotFoundError from "__tests__/utils/commonTests/clientErrors/testOpenWorkspaceNotFoundError.util";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";

describe("Test errors of moving the open workspace to the recycle bin.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The open workspace document not found.", async () => {
    await testOpenWorkspaceNotFoundError(() => moveWorkspaceToRecycleBin());
  });
});
