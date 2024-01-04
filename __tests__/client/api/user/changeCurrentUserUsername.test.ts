import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkNewlyCreatedDocs/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import changeCurrentUserUsername from "client_api/user/changeCurrentUserUsername.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
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
  }, BEFORE_ALL_TIMEOUT);

  it("Properly changes the current user username", async () => {
    let currentUser = await firstValueFrom(listenCurrentUser());
    const oldModificationTime = currentUser!.modificationTime.toMillis();
    const currentUsername = currentUser!.username;
    const newUsername = "changed " + currentUsername;

    changeCurrentUserUsername(newUsername);

    currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.username == newUsername))
    );
    expect(currentUser?.username).toStrictEqual(newUsername);
    expect(currentUser?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
  });

  it("Properly changes the current user username to an empty username", async () => {
    let currentUser = await firstValueFrom(listenCurrentUser());
    expect(currentUser!.username).not.toBeEmpty();
    const oldModificationTime = currentUser!.modificationTime.toMillis();

    changeCurrentUserUsername("");

    currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.username == ""))
    );
    expect(currentUser?.username).toStrictEqual("");
    expect(currentUser?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, "");
  });

  it("Properly changes the current user username from an empty username", async () => {
    const newUsername = "new username";
    await changeCurrentUserUsername("");
    let currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.username == ""))
    );
    const oldModificationTime = currentUser!.modificationTime.toMillis();

    changeCurrentUserUsername(newUsername);

    currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.username == newUsername))
    );
    expect(currentUser?.username).toStrictEqual(newUsername);
    expect(currentUser?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
  });
});
