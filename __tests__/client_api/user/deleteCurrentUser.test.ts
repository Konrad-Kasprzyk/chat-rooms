import globalBeforeAll from "__tests__/globalBeforeAll";
import { deleteCurrentUser } from "client_api/user.api";
import { app, auth as mockedAuth } from "db/firebase";
import { adminAuth, adminDb } from "db/firebase-admin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import COLLECTIONS from "global/constants/collections";
import createUserModel from "global/utils/admin_utils/createUserModel";
import { registerTestUsers, signInTestUser } from "global/utils/test_utils/testUsersMockedAuth";
import { v4 as uuidv4 } from "uuid";

describe("Test client api deleting user", () => {
  const actualAuth = getAuth(app);
  let userIdsToDelete: string[] = [];

  beforeAll(async () => {
    await globalBeforeAll();
    await actualAuth.signOut();
  });

  // Create and sign in real user and mocked test user
  beforeEach(async () => {
    const userAccount = registerTestUsers(1)[0];
    const password = uuidv4();
    const uid = await adminAuth
      .createUser({
        email: userAccount.email,
        password,
        displayName: userAccount.displayName,
        emailVerified: true,
      })
      .then((userRecord) => userRecord.uid);
    userIdsToDelete.push(uid);
    await signInWithEmailAndPassword(actualAuth, userAccount.email, password);
    userAccount.uid = uid;
    await signInTestUser(uid);
  });

  afterAll(async () => {
    await actualAuth.signOut();
    // Users with those ids should be already deleted, that's why catch used.
    await Promise.all(userIdsToDelete.map((uid) => adminAuth.deleteUser(uid).catch(() => {})));
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await mockedAuth.signOut();

    await expect(deleteCurrentUser()).toReject();
  });

  it("Deletes the user when the user document was not created", async () => {
    const uid = actualAuth.currentUser!.uid;

    await expect(deleteCurrentUser()).toResolve();

    const userSnap = await adminDb.collection(COLLECTIONS.users).doc(uid).get();
    expect(userSnap.exists).toBeFalse();
    await expect(adminAuth.getUser(uid)).toReject();
    expect(mockedAuth.currentUser).toBeNull();
  });

  it("It can sign out without an error when the current user has been deleted.", async () => {
    await expect(deleteCurrentUser()).toResolve();

    await actualAuth.signOut();
    expect(actualAuth.currentUser).toBeNull();
  });

  it("Deletes the user when the user document was created", async () => {
    const uid = actualAuth.currentUser!.uid;
    const email = actualAuth.currentUser!.email!;
    const username = actualAuth.currentUser!.displayName!;
    await createUserModel(uid, email, username);

    await expect(deleteCurrentUser()).toResolve();

    const userSnap = await adminDb.collection(COLLECTIONS.users).doc(uid).get();
    expect(userSnap.exists).toBeFalse();
    await expect(adminAuth.getUser(uid)).toReject();
    expect(mockedAuth.currentUser).toBeNull();
  });
});
