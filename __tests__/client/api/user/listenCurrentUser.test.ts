import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedUser from "__tests__/utils/checkDocs/checkDeletedUser.util";
import checkNewlyCreatedUser from "__tests__/utils/checkNewlyCreatedDocs/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import changeCurrentUserUsername from "client_api/user/changeCurrentUserUsername.api";
import listenCurrentUser, {
  _listenCurrentUserExportedForTesting,
} from "client_api/user/listenCurrentUser.api";
import markCurrentUserDeleted from "client_api/user/markCurrentUserDeleted.api";
import signOut from "client_api/user/signOut.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api returning subject listening current user document.", () => {
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;

  beforeAll(async () => {
    await globalBeforeAll();
  });

  /**
   * Creates and signs in the new test user for each test.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
  });

  it("Returns a null when the user is not signed in.", async () => {
    await signOut();

    const currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user == null))
    );

    expect(currentUser).toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Returns the user document.", async () => {
    const currentUser = await firstValueFrom(listenCurrentUser());

    expect(currentUser).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Returns the current user document after signing out and in.", async () => {
    const currentUserSubject = listenCurrentUser();
    await signOut();
    await firstValueFrom(currentUserSubject.pipe(filter((user) => user == null)));
    await signInTestUser(testUser.uid);

    const currentUser = await firstValueFrom(
      currentUserSubject.pipe(filter((user) => user?.id == testUser.uid))
    );

    expect(currentUser).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Updates the user when username changes.", async () => {
    const currentUserSubject = listenCurrentUser();
    let currentUser = await firstValueFrom(currentUserSubject);
    const oldModificationTime = currentUser!.modificationTime.toMillis();
    const newUsername = "changed " + currentUser!.username;

    changeCurrentUserUsername(newUsername);
    currentUser = await firstValueFrom(
      currentUserSubject.pipe(
        filter((user) => user?.id == testUser.uid && user.username == newUsername)
      )
    );

    expect(currentUser).not.toBeNull();
    expect(currentUser?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
  });

  it("Sends null when the user document is deleted.", async () => {
    const currentUserSubject = listenCurrentUser();

    await adminCollections.users.doc(testUser.uid).delete();
    await adminCollections.userDetails.doc(testUser.uid).delete();
    const currentUser = await firstValueFrom(
      currentUserSubject.pipe(filter((user) => user == null))
    );

    expect(currentUser).toBeNull();
    await checkDeletedUser(testUser.uid);
  });

  it("Sends null when the user is marked deleted.", async () => {
    const currentUserSubject = listenCurrentUser();

    markCurrentUserDeleted();
    const currentUser = await firstValueFrom(
      currentUserSubject.pipe(filter((user) => user == null))
    );

    expect(currentUser).toBeNull();
    await checkDeletedUser(testUser.uid);
  });

  it("After an error and function re-call, returns the current user document.", async () => {
    const currentUserSubject = listenCurrentUser();
    if (!_listenCurrentUserExportedForTesting)
      throw new Error("listenCurrentUser.api module didn't export functions for testing.");

    _listenCurrentUserExportedForTesting.setSubjectError();
    await expect(firstValueFrom(currentUserSubject)).toReject();
    const currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid))
    );

    expect(currentUser).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });
});
