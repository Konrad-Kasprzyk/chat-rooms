import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserDetailsDocumentNotFoundError from "__tests__/utils/commonTests/clientErrors/testUserDetailsDocumentNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import switchUserIdBetweenLinkedBotIds from "clientApi/user/switchUserIdBetweenLinkedBotIds.util";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of changing the signed in user id between linked bot ids.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user details document not found.", async () => {
    await testUserDetailsDocumentNotFoundError(() => switchUserIdBetweenLinkedBotIds("foo"));
  });

  it("The id to change the signed in user id is not found in the user's bot linked ids.", async () => {
    expect.assertions(1);
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUserId &&
            userDetails.linkedUserDocumentIds.length == USER_BOTS_COUNT + 1
        )
      )
    );

    await expect(switchUserIdBetweenLinkedBotIds("foo")).rejects.toThrow(
      "The provided id foo to change the signed in user id does not " +
        "belong to the actual signed in user's linked ids."
    );
  });
});
