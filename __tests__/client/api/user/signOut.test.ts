jest.mock<typeof import("client_api/utils/listeners.utils")>(
  "client_api/utils/listeners.utils",
  () => {
    const actualListenersModule = jest.requireActual<
      typeof import("client_api/utils/listeners.utils")
    >("client_api/utils/listeners.utils");
    return {
      ...actualListenersModule,
      removeAllListeners: jest.fn(actualListenersModule.removeAllListeners),
    };
  }
);

import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import signOut from "client_api/user/signOut.api";
import { removeAllListeners } from "client_api/utils/listeners.utils";
import auth from "common/db/auth.firebase";

describe("Test client api sign out method", () => {
  let testUser: { uid: string; email: string; displayName: string };

  beforeAll(async () => {
    await globalBeforeAll();
    testUser = registerTestUsers(1)[0];
  });

  beforeEach(async () => {
    if (!auth.currentUser) await signInTestUser(testUser.uid);
    jest.resetAllMocks();
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(2);
    const testUser = registerTestUsers(1)[0];
    await signInTestUser(testUser.uid);
    await auth.signOut();

    await expect(signOut()).toReject();

    expect(removeAllListeners).not.toHaveBeenCalled();
  });

  it("Signs out when the user document was not created", async () => {
    const testUser = registerTestUsers(1)[0];
    await signInTestUser(testUser.uid);

    await signOut();

    expect(auth.currentUser).toBeNull();
    expect(removeAllListeners).toHaveBeenCalled();
  });

  it("Signs out when the user document was created", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);

    await signOut();

    expect(auth.currentUser).toBeNull();
    expect(removeAllListeners).toHaveBeenCalled();
  });
});
