import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkNewlyCreatedDocs/checkNewlyCreatedUser.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import _createUserDocument from "client_api/user/signIn/_createUserDocument.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test creating a user document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

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
    expect(userDoc?.username).toEqual(changedUsername);
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
    expect(userDoc?.username).toStrictEqual("");
    await checkNewlyCreatedUser(registeredOnlyUser.uid, registeredOnlyUser.email, "");
  });
});
