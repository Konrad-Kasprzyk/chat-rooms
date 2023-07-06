import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDocs/checkUser";
import { deleteTestUserDocument } from "__tests__/utils/deleteTestUserDocument";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser";
import { changeCurrentUserUsername, getCurrentUser } from "client_api/user.api";
import User from "common/models/user.model";
import { auth } from "db/firebase";
import { firstValueFrom, skipWhile } from "rxjs";

describe("Test client api returning subject listening current user document", () => {
  let testUser: Readonly<User>;

  beforeAll(async () => {
    await globalBeforeAll();
  });

  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.id);
    await firstValueFrom(
      getCurrentUser().pipe(skipWhile((user) => !user || user.id !== testUser.id))
    );
  });

  it("Throws an error when the user is not signed in", async () => {
    await auth.signOut();

    expect(() => getCurrentUser()).toThrow();
  });

  it("Returns a user model", async () => {
    const currentUser = getCurrentUser().value;

    expect(currentUser).not.toBeNull();
    checkUser(currentUser!, testUser.id, testUser.email, testUser.username);
  });

  it("Updates the user when username changes", async () => {
    const currentUserSubject = getCurrentUser();
    const newUsername = "changed " + currentUserSubject.value!.username;

    changeCurrentUserUsername(newUsername);
    await firstValueFrom(
      getCurrentUser().pipe(skipWhile((user) => !user || user.username !== newUsername))
    );

    const currentUser = currentUserSubject.value;
    expect(currentUser).not.toBeNull();
    checkUser(currentUser!, testUser.id, testUser.email, newUsername);
  });

  it("Sends null when the user document is deleted", async () => {
    const currentUserSubject = getCurrentUser();

    await deleteTestUserDocument(testUser.id);
    await firstValueFrom(getCurrentUser().pipe(skipWhile((user) => user !== null)));

    expect(currentUserSubject.value).toBeNull();
  });
});
