import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import _createUserDocument from "clientApi/user/signIn/_createUserDocument.api";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { filter, firstValueFrom } from "rxjs";

describe("Test creating a user document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Creates the user document with linked user bot documents.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    await _createUserDocument(registeredOnlyUser.displayName);

    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == registeredOnlyUser.uid))
    );
    const userDetailsDoc = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == registeredOnlyUser.uid)
      )
    );
    expect(userDoc!.isBotUserDocument).toBeFalse();
    expect(userDetailsDoc!.linkedUserDocumentIds).toBeArrayOfSize(USER_BOTS_COUNT + 1);
    const userBotDocsSnap = await adminCollections.users
      .where(
        "id",
        "in",
        userDetailsDoc!.linkedUserDocumentIds.filter((id) => id != userDoc!.id)
      )
      .get();
    expect(userBotDocsSnap.size).toEqual(USER_BOTS_COUNT);
    const userBotDocs = userBotDocsSnap.docs.map((docSnap) => docSnap.data());
    // Sort documents by id
    userBotDocs.sort((u1, u2) => {
      if (u1.id < u2.id) return -1;
      if (u1.id === u2.id) return 0;
      return 1;
    });
    const checkUserPromises = [
      checkNewlyCreatedUser(
        registeredOnlyUser.uid,
        registeredOnlyUser.email,
        registeredOnlyUser.displayName
      ),
    ];
    for (let i = 0; i < USER_BOTS_COUNT; i++) {
      const userBot = userBotDocs[i];
      expect(userBot.id).toEqual(registeredOnlyUser.uid + `bot${i}`);
      expect(userBot.email).toEqual(
        registeredOnlyUser.email.split("@").join(`@taskKeeperBot${i}.`)
      );
      expect(userBot.username).toEqual(`bot-${i} ${registeredOnlyUser.displayName}`);
      expect(userBot.isBotUserDocument).toBeTrue();
      checkUserPromises.push(checkNewlyCreatedUser(userBot.id, userBot.email, userBot.username));
    }
    const userBotDetailsSnap = await adminCollections.userDetails
      .where(
        "id",
        "in",
        userDetailsDoc!.linkedUserDocumentIds.filter((id) => id != userDoc!.id)
      )
      .get();
    expect(userBotDetailsSnap.size).toEqual(USER_BOTS_COUNT);
    const userBotDetailsDocs = userBotDetailsSnap.docs.map((docSnap) => docSnap.data());
    // Sort documents by id
    userBotDetailsDocs.sort((u1, u2) => {
      if (u1.id < u2.id) return -1;
      if (u1.id === u2.id) return 0;
      return 1;
    });
    for (let i = 0; i < USER_BOTS_COUNT; i++) {
      const userBotDetails = userBotDetailsDocs[i];
      expect(userBotDetails.id).toEqual(registeredOnlyUser.uid + `bot${i}`);
      expect(userBotDetails.linkedUserDocumentIds).toEqual(userDetailsDoc!.linkedUserDocumentIds);
      expect(userBotDetails.mainUserId).toEqual(registeredOnlyUser.uid);
    }
    await Promise.all(checkUserPromises);
  });

  it("Creates the user document with the provided username.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    const changedUsername = "changed username of " + registeredOnlyUser.displayName;
    await signInTestUser(registeredOnlyUser.uid);

    await _createUserDocument(changedUsername);

    const userDetailsDoc = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((ud) => ud?.id == registeredOnlyUser.uid))
    );
    expect(userDetailsDoc).toBeTruthy();
    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((u) => u?.id == registeredOnlyUser.uid && u.username == changedUsername)
      )
    );
    expect(userDoc!.username).toEqual(changedUsername);
    await checkNewlyCreatedUser(registeredOnlyUser.uid, registeredOnlyUser.email, changedUsername);
  });

  it("Creates the user document without a username.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    await _createUserDocument("");

    const userDetailsDoc = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((ud) => ud?.id == registeredOnlyUser.uid))
    );
    expect(userDetailsDoc).toBeTruthy();
    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((u) => u?.id == registeredOnlyUser.uid && u.username == ""))
    );
    expect(userDoc!.username).toStrictEqual("");
    await checkNewlyCreatedUser(registeredOnlyUser.uid, registeredOnlyUser.email, "");
  });
});
