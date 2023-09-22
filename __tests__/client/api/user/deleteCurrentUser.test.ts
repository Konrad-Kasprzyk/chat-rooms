jest.unmock("common/db/auth.firebase");

import globalBeforeAll from "__tests__/globalBeforeAll";
import deleteCurrentUser from "client_api/user/deleteCurrentUser.api";
import _createUserDocument from "client_api/user/signIn/_createUserDocument.api";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import { deleteTestUserAccount } from "common/test_utils/deleteTestUserAccount.util";
import { registerTestUserEmailPassword } from "common/test_utils/registerTestUserEmailPassword.util";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

describe("Test client api deleting user", () => {
  let userIdsToDelete: string[] = [];
  let uid: string;
  let displayName: string;
  let email: string;
  let password: string;

  beforeAll(async () => {
    await globalBeforeAll();
    await auth.signOut();
  });

  // Create and sign in real user
  beforeEach(async () => {
    uid = uuidv4();
    email = uid + "@normkeeper-testing.api";
    displayName = "Testing user";
    password = uuidv4();
    uid = await registerTestUserEmailPassword(email, password, displayName);
    userIdsToDelete.push(uid);
    await signInWithEmailAndPassword(auth, email, password);
  });

  afterAll(async () => {
    await auth.signOut();
    // Users with those ids should be already deleted, that's why catch used.
    await Promise.all(userIdsToDelete.map((uid) => deleteTestUserAccount(uid).catch(() => {})));
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await auth.signOut();

    await expect(deleteCurrentUser()).toReject();
  });

  it("Deletes the user when the user document was not created", async () => {
    await expect(deleteCurrentUser()).toResolve();

    // TODO if user is not signed in, then firestore rules will reject this query
    // Maybe add in beforeEach created user to workspace where main test user belongs,
    // sign in as main test user and then check if deleted user document exists
    const userSnap = await getDoc(doc(collections.users, uid));
    expect(userSnap.exists()).toBeFalse();
    await expect(signInWithEmailAndPassword(auth, email, password)).rejects.toHaveProperty(
      "code",
      "auth/user-not-found"
    );
    expect(auth.currentUser).toBeNull();
  });

  it("Deletes the user when the user document was created", async () => {
    await _createUserDocument(displayName);

    await expect(deleteCurrentUser()).toResolve();

    // TODO if user is not signed in, then firestore rules will reject this query
    // Maybe add in beforeEach created user to workspace where main test user belongs,
    // sign in as main test user and then check if deleted user document exists
    //
    // TODO OR maybe just use an admin app?
    const userSnap = await getDoc(doc(collections.users, uid));
    expect(userSnap.exists()).toBeFalse();
    await expect(signInWithEmailAndPassword(auth, email, password)).rejects.toHaveProperty(
      "code",
      "auth/user-not-found"
    );
    expect(auth.currentUser).toBeNull();
  });

  it("It can sign out without an error when the current user has been deleted.", async () => {
    await expect(deleteCurrentUser()).toResolve();
    expect(auth.currentUser).toBeNull();

    await auth.signOut();
  });
});
