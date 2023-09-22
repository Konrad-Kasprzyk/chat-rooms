import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import signOut from "client_api/user/signOut.api";
import { getSignedInUserId } from "client_api/user/signedInUserId.utils";
import auth from "common/db/auth.firebase";

describe("Test client api sign out method", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(2);
    const testUser = registerTestUsers(1)[0];
    await signInTestUser(testUser.uid);
    await signOut();

    expect(getSignedInUserId()).toBeNull();
    await expect(signOut()).toReject();
  });

  it("Signs out when the user document was not created", async () => {
    const testUser = registerTestUsers(1)[0];
    await signInTestUser(testUser.uid);

    await signOut();

    expect(auth.currentUser).toBeNull();
    expect(getSignedInUserId()).toBeNull();
  });

  it("Signs out when the user document was created", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);

    await signOut();

    expect(auth.currentUser).toBeNull();
    expect(getSignedInUserId()).toBeNull();
  });
});
