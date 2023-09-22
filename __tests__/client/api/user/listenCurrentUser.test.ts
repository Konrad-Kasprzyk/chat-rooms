import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDocs/checkUser.util";
import { deleteTestUserDocument } from "__tests__/utils/deleteTestUserDocument.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import changeCurrentUserUsername from "client_api/user/changeCurrentUserUsername.api";
import listenCurrentUser, {
  _listenCurrentUserExportedForTesting,
} from "client_api/user/listenCurrentUser.api";
import signOut from "client_api/user/signOut.api";
import { firstValueFrom, skipWhile } from "rxjs";

describe("Test client api returning subject listening current user document.", () => {
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

  it("Returns a null when the user is not signed in.", async () => {
    await signOut();

    const currentUser = await firstValueFrom(listenCurrentUser().pipe(skipWhile((user) => !!user)));

    expect(currentUser).toBeNull();
  });

  it("Returns the user document.", async () => {
    const currentUser = await firstValueFrom(listenCurrentUser());

    expect(currentUser).not.toBeNull();
    checkUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Returns the current user document after signing out and in.", async () => {
    const currentUserSubject = listenCurrentUser();
    await signOut();
    await firstValueFrom(currentUserSubject.pipe(skipWhile((user) => !!user)));
    await signInTestUser(testUser.uid);

    const currentUser = await firstValueFrom(currentUserSubject.pipe(skipWhile((user) => !user)));

    expect(currentUser).not.toBeNull();
    checkUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Updates the user when username changes.", async () => {
    const currentUserSubject = listenCurrentUser();
    let currentUser = await firstValueFrom(currentUserSubject);
    const newUsername = "changed " + currentUser!.username;

    changeCurrentUserUsername(newUsername);
    currentUser = await firstValueFrom(
      currentUserSubject.pipe(skipWhile((user) => !user || user.username !== newUsername))
    );

    expect(currentUser).not.toBeNull();
    checkUser(testUser.uid, testUser.email, newUsername);
  });

  it("Sends null when the user document is deleted,", async () => {
    const currentUserSubject = listenCurrentUser();

    deleteTestUserDocument(testUser.uid);
    const currentUser = await firstValueFrom(currentUserSubject.pipe(skipWhile((user) => !!user)));

    expect(currentUser).toBeNull();
  });

  it("After an error and function re-call, returns the current user document.", async () => {
    const currentUserSubject = listenCurrentUser();
    if (!_listenCurrentUserExportedForTesting)
      throw new Error("listenCurrentUser.api module didn't export functions for testing.");

    _listenCurrentUserExportedForTesting.setSubjectError();
    await expect(firstValueFrom(currentUserSubject)).toReject();
    const currentUser = await firstValueFrom(listenCurrentUser().pipe(skipWhile((user) => !user)));

    expect(currentUser).not.toBeNull();
    checkUser(testUser.uid, testUser.email, testUser.displayName);
  });
});
