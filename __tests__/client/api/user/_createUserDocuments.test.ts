import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser, {
  _listenCurrentUserExportedForTesting,
} from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import _createUserDocuments from "client/api/user/signIn/_createUserDocuments.api";
import EMAIL_SUFFIX from "common/constants/emailSuffix.constant";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { filter, firstValueFrom } from "rxjs";

describe("Test creating user documents.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  beforeEach(() => {
    if (!_listenCurrentUserExportedForTesting)
      throw new Error("listenCurrentUser.api module didn't export functions for testing.");
    _listenCurrentUserExportedForTesting.resetModule();
  });

  it("Creates the user document with linked user bot documents when an email is provided.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    const username = "Test username of " + registeredOnlyUser.displayName;
    await signInTestUser(registeredOnlyUser.uid);

    await _createUserDocuments(username);

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
      checkNewlyCreatedUser(registeredOnlyUser.uid, registeredOnlyUser.email, username),
    ];
    for (let i = 0; i < USER_BOTS_COUNT; i++) {
      const userBotDTO = userBotDocs[i];
      expect(userBotDTO.id).toEqual(`bot${i + 1}` + registeredOnlyUser.uid);
      expect(userBotDTO.email).toEqual(`${userBotDTO.id}${EMAIL_SUFFIX}`);
      expect(userBotDTO.username).toEqual(`#${i + 1} ${username}`);
      expect(userBotDTO.isBotUserDocument).toBeTrue();
      checkUserPromises.push(
        checkNewlyCreatedUser(userBotDTO.id, userBotDTO.email, userBotDTO.username)
      );
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
      const userBotDetailsDTO = userBotDetailsDocs[i];
      expect(userBotDetailsDTO.id).toEqual(`bot${i + 1}` + registeredOnlyUser.uid);
      expect(userBotDetailsDTO.botNumber).toEqual(i);
      expect(userBotDetailsDTO.linkedUserDocumentIds.sort()).toEqual(
        userDetailsDoc!.linkedUserDocumentIds
      );
      expect(userBotDetailsDTO.mainUserId).toEqual(registeredOnlyUser.uid);
    }
    await Promise.all(checkUserPromises);
  });

  it(
    "Creates the user document with linked user bot documents if the user is anonymous " +
      "and no email is provided.",
    async () => {
      const anonymousUser = registerTestUsers(1, true)[0];
      const username = "Test username of " + anonymousUser.displayName;
      await signInTestUser(anonymousUser.uid);

      await _createUserDocuments(username);

      const userDoc = await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == anonymousUser.uid))
      );
      const userDetailsDoc = await firstValueFrom(
        listenCurrentUserDetails().pipe(
          filter((userDetails) => userDetails?.id == anonymousUser.uid)
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
        checkNewlyCreatedUser(anonymousUser.uid, `${anonymousUser.uid}${EMAIL_SUFFIX}`, username),
      ];
      for (let i = 0; i < USER_BOTS_COUNT; i++) {
        const userBotDTO = userBotDocs[i];
        expect(userBotDTO.id).toEqual(`bot${i + 1}` + anonymousUser.uid);
        expect(userBotDTO.email).toEqual(`${userBotDTO.id}${EMAIL_SUFFIX}`);
        expect(userBotDTO.username).toEqual(`#${i + 1} ${username}`);
        expect(userBotDTO.isBotUserDocument).toBeTrue();
        checkUserPromises.push(
          checkNewlyCreatedUser(userBotDTO.id, userBotDTO.email, userBotDTO.username)
        );
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
        const userBotDetailsDTO = userBotDetailsDocs[i];
        expect(userBotDetailsDTO.id).toEqual(`bot${i + 1}` + anonymousUser.uid);
        expect(userBotDetailsDTO.botNumber).toEqual(i);
        expect(userBotDetailsDTO.linkedUserDocumentIds.sort()).toEqual(
          userDetailsDoc!.linkedUserDocumentIds
        );
        expect(userBotDetailsDTO.mainUserId).toEqual(anonymousUser.uid);
      }
      await Promise.all(checkUserPromises);
    }
  );
});
