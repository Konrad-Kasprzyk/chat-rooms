import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedUser from "__tests__/utils/checkDocs/deletedOrMarkedAsDeleted/checkDeletedUser.util";
import checkNewlyCreatedUser from "__tests__/utils/checkDocs/newlyCreated/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import changeCurrentUserUsername from "clientApi/user/changeCurrentUserUsername.api";
import listenCurrentUser, {
  _listenCurrentUserExportedForTesting,
} from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import signOut from "clientApi/user/signOut.api";
import validateUser from "common/modelValidators/validateUser.util";
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
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && !user.dataFromFirebaseAccount)
      )
    );
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

  it(
    "Returns a document with data from the firebase account if " +
      "user and user details documents do not exist.",
    async () => {
      const currentUserSubject = listenCurrentUser();

      await Promise.all([
        adminCollections.users.doc(testUser.uid).delete(),
        adminCollections.userDetails.doc(testUser.uid).delete(),
      ]);
      const currentUser = await firstValueFrom(
        currentUserSubject.pipe(
          filter((user) => user?.id == testUser.uid && user.dataFromFirebaseAccount)
        )
      );

      expect(currentUser!.id).toEqual(testUser.uid);
      expect(currentUser!.email).toEqual(testUser.email);
      expect(currentUser!.username).toEqual(testUser.displayName);
      expect(currentUser!.dataFromFirebaseAccount).toBeTrue();
      validateUser(currentUser);
      await checkDeletedUser(testUser.uid);
    }
  );

  it(
    "Returns a document with data from the firebase account if " +
      "user and user details documents have the deleted flag set.",
    async () => {
      const currentUserSubject = listenCurrentUser();

      await Promise.all([
        adminCollections.users
          .doc(testUser.uid)
          .update({ isDeleted: true, modificationTime: FieldValue.serverTimestamp() }),
        adminCollections.userDetails.doc(testUser.uid).update({ isDeleted: true }),
      ]);
      const currentUser = await firstValueFrom(
        currentUserSubject.pipe(
          filter((user) => user?.id == testUser.uid && user.dataFromFirebaseAccount)
        )
      );

      expect(currentUser!.id).toEqual(testUser.uid);
      expect(currentUser!.email).toEqual(testUser.email);
      expect(currentUser!.username).toEqual(testUser.displayName);
      expect(currentUser!.dataFromFirebaseAccount).toBeTrue();
      validateUser(currentUser);
      await checkDeletedUser(testUser.uid);
    }
  );

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
    expect(currentUser!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
  });

  it("After signing out, returns the updated user document after signing in again.", async () => {
    const currentUserSubject = listenCurrentUser();
    let currentUser = await firstValueFrom(currentUserSubject);
    const oldModificationTime = currentUser!.modificationTime.toMillis();
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
    expect(currentUser!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
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
