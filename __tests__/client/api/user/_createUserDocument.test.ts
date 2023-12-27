import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkNewlyCreatedDocs/checkNewlyCreatedUser.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import _createUserDocument from "client_api/user/signIn/_createUserDocument.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test creating a user document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  });

  it("Creates the user document with the provided username.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    await _createUserDocument(registeredOnlyUser.displayName);

    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((u) => u?.id == registeredOnlyUser.uid))
    );
    expect(userDoc?.username).toEqual(registeredOnlyUser.displayName);
    await checkNewlyCreatedUser(
      registeredOnlyUser.uid,
      registeredOnlyUser.email,
      registeredOnlyUser.displayName
    );
  });

  it("Creates the user document without a username.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    await _createUserDocument("");

    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((u) => u?.id == registeredOnlyUser.uid))
    );
    expect(userDoc?.username).toBeEmpty();
    await checkNewlyCreatedUser(registeredOnlyUser.uid, registeredOnlyUser.email, "");
  });
});
