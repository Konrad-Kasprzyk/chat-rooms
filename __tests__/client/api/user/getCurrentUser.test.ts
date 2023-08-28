import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDocs/checkUser.util";
import { deleteTestUserDocument } from "__tests__/utils/deleteTestUserDocument.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import changeCurrentUserUsername from "client_api/user/changeCurrentUserUsername.api";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import auth from "common/db/auth.firebase";
import { firstValueFrom, skipWhile } from "rxjs";

describe("Test client api returning subject listening current user document", () => {
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;

  beforeAll(async () => {
    await globalBeforeAll();
  });

  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(skipWhile((user) => !user || user.id !== testUser.uid))
    );
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await auth.signOut();

    expect(() => listenCurrentUser()).toThrow();
  });

  it("Returns a user model", async () => {
    const currentUser = await firstValueFrom(listenCurrentUser());

    expect(currentUser).not.toBeNull();
    checkUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Updates the user when username changes", async () => {
    const currentUserSubject = listenCurrentUser();
    let currentUser = await firstValueFrom(currentUserSubject);
    const newUsername = "changed " + currentUser!.username;

    changeCurrentUserUsername(newUsername);
    await firstValueFrom(
      listenCurrentUser().pipe(skipWhile((user) => !user || user.username !== newUsername))
    );

    currentUser = await firstValueFrom(currentUserSubject);
    expect(currentUser).not.toBeNull();
    checkUser(testUser.uid, testUser.email, newUsername);
  });

  it("Sends null when the user document is deleted", async () => {
    const currentUserSubject = listenCurrentUser();

    await deleteTestUserDocument(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(skipWhile((user) => user !== null)));

    const currentUser = await firstValueFrom(currentUserSubject);
    expect(currentUser).toBeNull();
  });
});
