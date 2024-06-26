jest.mock<typeof import("client/api/user/signOut.api")>("client/api/user/signOut.api", () => {
  return {
    __esModule: true,
    default: jest.fn(
      jest.requireActual<typeof import("client/api/user/signOut.api")>(
        "client/api/user/signOut.api"
      ).default
    ),
  };
});

import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedUser from "__tests__/utils/checkDTODocs/deletedOrMarkedAsDeleted/checkDeletedUser.util";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import { FieldValue } from "firebase-admin/firestore";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api returning subject listening current user document.", () => {
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates and signs in the new test user for each test.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
  });

  it("Returns a null when the user is not signed in.", async () => {
    await signOut();

    const currentUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user == null))
    );

    expect(currentUser).toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Returns a null if the user document do not exist.", async () => {
    const currentUserSubject = listenCurrentUser();

    await Promise.all([
      adminCollections.users.doc(testUser.uid).delete(),
      adminCollections.userDetails.doc(testUser.uid).delete(),
    ]);
    const currentUser = await firstValueFrom(
      currentUserSubject.pipe(filter((user) => user == null))
    );

    expect(currentUser).toBeNull();
    await checkDeletedUser(testUser.uid);
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
    const oldModificationTime = currentUser!.modificationTime;
    const newUsername = "changed " + currentUser!.username;

    changeCurrentUserUsername(newUsername);
    currentUser = await firstValueFrom(
      currentUserSubject.pipe(
        filter((user) => user?.id == testUser.uid && user.username == newUsername)
      )
    );

    expect(currentUser).not.toBeNull();
    expect(currentUser!.modificationTime).toBeAfter(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
  });

  it("After signing out, returns the updated user document after signing in again.", async () => {
    const currentUserSubject = listenCurrentUser();
    let currentUser = await firstValueFrom(currentUserSubject);
    const oldModificationTime = currentUser!.modificationTime;
    await signOut();
    await firstValueFrom(currentUserSubject.pipe(filter((user) => user == null)));
    const newUsername = "changed " + testUser.displayName;
    await adminCollections.users
      .doc(testUser.uid)
      .update({ username: newUsername, modificationTime: FieldValue.serverTimestamp() });

    await signInTestUser(testUser.uid);
    currentUser = await firstValueFrom(
      currentUserSubject.pipe(
        filter((user) => user?.id == testUser.uid && user.username == newUsername)
      )
    );

    expect(currentUser).not.toBeNull();
    expect(currentUser!.modificationTime).toBeAfter(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
  });
});
