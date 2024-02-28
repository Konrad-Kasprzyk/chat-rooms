import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUsersHistoryNotFoundError from "__tests__/utils/commonTests/backendErrors/historyNotFound/testUsersHistoryNotFoundError.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";

describe("Test errors of marking a user as deleted.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The users history document not found.", async () => {
    await testUsersHistoryNotFoundError(CLIENT_API_URLS.user.markUserDeleted);
  });
});
