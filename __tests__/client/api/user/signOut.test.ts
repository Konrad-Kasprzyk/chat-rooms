import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkNewlyCreatedDocs/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import signOut from "client_api/user/signOut.api";
import { getSignedInUserId } from "client_api/user/signedInUserId.utils";
import auth from "common/db/auth.firebase";

describe("Test client api sign out method", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

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
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });
});
