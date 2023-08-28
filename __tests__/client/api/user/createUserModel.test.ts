import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDocs/checkUser.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import _createUserDocuments from "client_api/user/signIn/_createUserDocuments.api";
import auth from "common/db/auth.firebase";

describe("Test client api creating user model", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(1);
    await auth.signOut();

    await expect(_createUserDocuments("username")).toReject();
  });

  it("Properly creates the user model", async () => {
    const userAccount = registerTestUsers(1)[0];
    await signInTestUser(userAccount.uid);

    await _createUserDocuments(userAccount.displayName);

    checkUser(userAccount.uid, userAccount.email, userAccount.displayName);
  });

  it("Doesn't create the user model, when it already exists", async () => {
    const userAccount = registerTestUsers(1)[0];
    await signInTestUser(userAccount.uid);

    await expect(_createUserDocuments(userAccount.displayName)).toResolve();
    await expect(_createUserDocuments(userAccount.displayName)).toReject();

    checkUser(userAccount.uid, userAccount.email, userAccount.displayName);
  });
});
