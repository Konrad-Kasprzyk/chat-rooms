import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUsersHistoryNotFoundError from "__tests__/utils/commonTests/backendErrors/historyNotFound/testUsersHistoryNotFoundError.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";

describe("Test errors of deleting user documents and account.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The users history document not found.", async () => {
    await testUsersHistoryNotFoundError(CLIENT_API_URLS.user.deleteUserDocumentsAndAccount);
  });
});
