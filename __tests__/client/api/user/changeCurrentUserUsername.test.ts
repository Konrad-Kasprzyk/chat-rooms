import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import changeCurrentUserUsername from "client_api/user/changeCurrentUserUsername.api";
import getCurrentUser from "client_api/user/getCurrentUser.api";
import User from "common/models/user.model";
import auth from "db/client/auth.firebase";
import { firstValueFrom, skipWhile } from "rxjs";

describe("Test client api changing the current user username", () => {
  let testUser: Readonly<User>;

  beforeAll(async () => {
    await globalBeforeAll();
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
  });

  beforeEach(async () => {
    if (!auth.currentUser) await signInTestUser(testUser.id);
    // Await for the current user document to be defined
    await firstValueFrom(getCurrentUser().pipe(skipWhile((user) => user === null)));
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await auth.signOut();

    await expect(changeCurrentUserUsername("changed " + testUser.username)).toReject();
  });

  it("Properly changes the current user username", async () => {
    const currentUsername = getCurrentUser().value!.username;
    const newUsername = "changed " + currentUsername;

    changeCurrentUserUsername(newUsername);

    const currentUser = await firstValueFrom(
      getCurrentUser().pipe(skipWhile((user) => !user || user.username === currentUsername))
    );
    expect(currentUser?.username).toStrictEqual(newUsername);
  });

  it("Properly changes the current user username to an empty username", async () => {
    expect(getCurrentUser().value!.username).not.toBeEmpty();

    changeCurrentUserUsername("");

    const currentUser = await firstValueFrom(
      getCurrentUser().pipe(skipWhile((user) => !user || user.username !== ""))
    );
    expect(currentUser?.username).toStrictEqual<string>("");
  });

  it("Properly changes the current user username from an empty username", async () => {
    await changeCurrentUserUsername("");
    await firstValueFrom(getCurrentUser().pipe(skipWhile((user) => !user || user.username !== "")));
    expect(getCurrentUser().value!.username).toStrictEqual<string>("");

    changeCurrentUserUsername("new username");

    const currentUser = await firstValueFrom(
      getCurrentUser().pipe(skipWhile((user) => !user || user.username === ""))
    );
    expect(currentUser?.username).toStrictEqual<string>("new username");
  });
});
