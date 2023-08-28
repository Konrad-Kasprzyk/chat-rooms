import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import changeCurrentUserUsername from "client_api/user/changeCurrentUserUsername.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import auth from "common/db/auth.firebase";
import { firstValueFrom, skipWhile } from "rxjs";

describe("Test client api changing the current user username", () => {
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;

  beforeAll(async () => {
    await globalBeforeAll();
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
  });

  beforeEach(async () => {
    if (!auth.currentUser) await signInTestUser(testUser.uid);
    // Await for the current user document to be defined
    await firstValueFrom(listenCurrentUser().pipe(skipWhile((user) => user === null)));
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await auth.signOut();

    await expect(changeCurrentUserUsername("changed " + testUser.displayName)).toReject();
  });

  it("Properly changes the current user username", async () => {
    let currentUser = await firstValueFrom(listenCurrentUser());
    const currentUsername = currentUser!.username;
    const newUsername = "changed " + currentUsername;

    changeCurrentUserUsername(newUsername);

    currentUser = await firstValueFrom(
      listenCurrentUser().pipe(skipWhile((user) => !user || user.username === currentUsername))
    );
    expect(currentUser!.username).toStrictEqual(newUsername);
  });

  it("Properly changes the current user username to an empty username", async () => {
    let currentUser = await firstValueFrom(listenCurrentUser());
    expect(currentUser!.username).not.toBeEmpty();

    changeCurrentUserUsername("");

    currentUser = await firstValueFrom(
      listenCurrentUser().pipe(skipWhile((user) => !user || user.username !== ""))
    );
    expect(currentUser!.username).toStrictEqual("");
  });

  it("Properly changes the current user username from an empty username", async () => {
    await changeCurrentUserUsername("");
    let currentUser = await firstValueFrom(
      listenCurrentUser().pipe(skipWhile((user) => !user || user.username !== ""))
    );
    expect(currentUser!.username).toStrictEqual("");

    changeCurrentUserUsername("new username");

    currentUser = await firstValueFrom(
      listenCurrentUser().pipe(skipWhile((user) => !user || user.username === ""))
    );
    expect(currentUser!.username).toStrictEqual("new username");
  });
});
