import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import EMAIL_SUFFIX from "common/constants/emailSuffix.constant";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api changing the current user username", () => {
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;

  /**
   * Creates and signs in the test user.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
  }, BEFORE_ALL_TIMEOUT);

  it("Properly changes the current user username", async () => {
    let currentUser = await firstValueFrom(listenCurrentUser());
    const oldModificationTime = currentUser!.modificationTime;
    const currentUsername = currentUser!.username;
    const newUsername = "changed " + currentUsername;

    await changeCurrentUserUsername(newUsername);

    currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.username == newUsername))
    );
    expect(currentUser!.username).toStrictEqual(newUsername);
    expect(currentUser!.modificationTime).toBeAfter(oldModificationTime);
    const userDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    const userBotsSnap = await adminCollections.users
      .where(
        "id",
        "in",
        userDetails!.linkedUserDocumentIds.filter((id) => id != testUser.uid)
      )
      .get();
    expect(userBotsSnap.size).toEqual(USER_BOTS_COUNT);
    const userBotDocs = userBotsSnap.docs.map((docSnap) => docSnap.data());
    // Sort documents by id
    userBotDocs.sort((u1, u2) => {
      if (u1.id < u2.id) return -1;
      if (u1.id === u2.id) return 0;
      return 1;
    });
    const checkUserPromises = [checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername)];
    for (let i = 0; i < USER_BOTS_COUNT; i++) {
      const userBot = userBotDocs[i];
      expect(userBot.id).toEqual(`bot${i + 1}` + testUser.uid);
      expect(userBot.email).toEqual(`${userBot.id}${EMAIL_SUFFIX}`);
      expect(userBot.username).toEqual(`#${i + 1} ${newUsername}`);
      expect(userBot.isBotUserDocument).toBeTrue();
      checkUserPromises.push(checkNewlyCreatedUser(userBot.id, userBot.email, userBot.username));
    }
  });
});
