import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkUser";
import { exportedForTesting } from "client_api/user.api";
import { auth } from "db/firebase";
import { adminDb } from "db/firebase-admin";
import COLLECTIONS from "global/constants/collections";
import User from "global/models/user.model";
import { registerTestUsers, signInTestUser } from "global/utils/test_utils/testUsersMockedAuth";

const { createUserModel } = exportedForTesting;

describe("Test client api creating user model", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await auth.signOut();

    await expect(createUserModel!("username")).toReject();
  });

  it("Properly creates the user model", async () => {
    const userAccount = registerTestUsers(1)[0];
    await signInTestUser(userAccount.uid);

    await createUserModel!(userAccount.displayName);

    const userRef = adminDb.collection(COLLECTIONS.users).doc(userAccount.uid);
    const userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    const user = userSnap.data() as User;
    checkUser(user, userAccount.uid, userAccount.email, userAccount.displayName);
  });

  it("Doesn't create the user model, when it already exists", async () => {
    const userAccount = registerTestUsers(1)[0];
    await signInTestUser(userAccount.uid);

    await expect(createUserModel!(userAccount.displayName)).toResolve();
    await expect(createUserModel!(userAccount.displayName)).toReject();

    const userRef = adminDb.collection(COLLECTIONS.users).doc(userAccount.uid);
    const userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    const user = userSnap.data() as User;
    checkUser(user, userAccount.uid, userAccount.email, userAccount.displayName);
  });
});
