import globalBeforeAll from "__tests__/globalBeforeAll";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { deleteCurrentUser, exportedForTesting } from "client_api/user.api";
import { deleteTestUserAccount } from "common/test_utils/deleteTestUserAccount.util";
import { registerTestUserEmailPassword } from "common/test_utils/registerTestUserEmailPassword.util";
import { Collections, app, auth as mockedAuth } from "db/client/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const { createUserModel } = exportedForTesting;

describe("Test client api deleting user", () => {
  const actualAuth = getAuth(app);
  let userIdsToDelete: string[] = [];
  let uid: string;
  let displayName: string;
  let email: string;
  let password: string;

  beforeAll(async () => {
    await globalBeforeAll();
    await actualAuth.signOut();
  });

  // Create and sign in real user and mocked test user
  beforeEach(async () => {
    const userAccount = registerTestUsers(1)[0];
    password = uuidv4();
    email = userAccount.email;
    displayName = userAccount.displayName;
    uid = await registerTestUserEmailPassword(email, password, displayName);
    userIdsToDelete.push(uid);
    await signInWithEmailAndPassword(actualAuth, userAccount.email, password);
    userAccount.uid = uid;
    await signInTestUser(uid);
  });

  afterAll(async () => {
    await actualAuth.signOut();
    // Users with those ids should be already deleted, that's why catch used.
    await Promise.all(userIdsToDelete.map((uid) => deleteTestUserAccount(uid).catch(() => {})));
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await mockedAuth.signOut();

    await expect(deleteCurrentUser()).toReject();
  });

  it("Deletes the user when the user document was not created", async () => {
    await expect(deleteCurrentUser()).toResolve();

    // TODO if user is not signed in, then firestore rules will reject this query
    // Maybe add in beforeEach created user to workspace where main test user belongs,
    // sign in as main test user and then check if deleted user document exists
    const userSnap = await getDoc(doc(Collections.users, uid));
    expect(userSnap.exists()).toBeFalse();
    await expect(signInWithEmailAndPassword(actualAuth, email, password)).rejects.toHaveProperty(
      "code",
      "auth/user-not-found"
    );
    expect(mockedAuth.currentUser).toBeNull();
  });

  it("It can sign out without an error when the current user has been deleted.", async () => {
    await expect(deleteCurrentUser()).toResolve();

    await actualAuth.signOut();
    expect(actualAuth.currentUser).toBeNull();
  });

  it("Deletes the user when the user document was created", async () => {
    await createUserModel!(displayName);

    await expect(deleteCurrentUser()).toResolve();

    // TODO if user is not signed in, then firestore rules will reject this query
    // Maybe add in beforeEach created user to workspace where main test user belongs,
    // sign in as main test user and then check if deleted user document exists
    const userSnap = await getDoc(doc(Collections.users, uid));
    expect(userSnap.exists()).toBeFalse();
    await expect(signInWithEmailAndPassword(actualAuth, email, password)).rejects.toHaveProperty(
      "code",
      "auth/user-not-found"
    );
    expect(mockedAuth.currentUser).toBeNull();
  });
});
