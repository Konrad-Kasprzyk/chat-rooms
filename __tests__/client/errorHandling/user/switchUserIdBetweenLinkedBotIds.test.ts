import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import signOut from "clientApi/user/signOut.api";
import switchUserIdBetweenLinkedBotIds from "clientApi/user/switchUserIdBetweenLinkedBotIds.util";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import auth from "common/db/auth.firebase";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of changing the signed in user id between linked bot ids.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The user document not found.", async () => {
    expect.assertions(1);
    if (auth.currentUser) await signOut();
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));

    await expect(switchUserIdBetweenLinkedBotIds("foo")).rejects.toThrow(
      "The user document not found."
    );
  });

  it("The id to change the signed in user id is not found in the user's bot linked ids.", async () => {
    expect.assertions(1);
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == testUserId &&
            !user.dataFromFirebaseAccount &&
            user.linkedUserDocumentIds.length == USER_BOTS_COUNT + 1
        )
      )
    );

    await expect(switchUserIdBetweenLinkedBotIds("foo")).rejects.toThrow(
      "The provided id foo to change the signed in user id does not " +
        "belong to the actual signed in user's linked ids."
    );
  });

  it(
    "The id to change the signed in user id is not found, because the user doc is created from " +
      "the firebase account data and does not have the linked bot ids.",
    async () => {
      expect.assertions(1);
      const testUserId = registerTestUsers(1)[0].uid;
      await signInTestUser(testUserId);
      await firstValueFrom(
        listenCurrentUser().pipe(
          filter(
            (user) =>
              user?.id == testUserId &&
              user.dataFromFirebaseAccount &&
              user.linkedUserDocumentIds.length == 0
          )
        )
      );

      await expect(switchUserIdBetweenLinkedBotIds("foo")).rejects.toThrow(
        "The provided id foo to change the signed in user id does not " +
          "belong to the actual signed in user's linked ids."
      );
    }
  );
});
