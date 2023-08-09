import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDocs/checkUser.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { exportedForTesting } from "client_api/user.api";
import { Collections, auth } from "db/client/firebase";
import { doc, getDoc } from "firebase/firestore";

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

    const userRef = doc(Collections.users, userAccount.uid);
    const user = (await getDoc(userRef)).data();
    checkUser(user!, userAccount.uid, userAccount.email, userAccount.displayName, true);
  });

  it("Doesn't create the user model, when it already exists", async () => {
    const userAccount = registerTestUsers(1)[0];
    await signInTestUser(userAccount.uid);

    await expect(createUserModel!(userAccount.displayName)).toResolve();
    await expect(createUserModel!(userAccount.displayName)).toReject();

    const userRef = doc(Collections.users, userAccount.uid);
    const user = (await getDoc(userRef)).data();
    checkUser(user!, userAccount.uid, userAccount.email, userAccount.displayName, true);
  });
});
