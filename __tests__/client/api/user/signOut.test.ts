jest.mock("client_api/utils/subscriptions.utils", () => {
  const removeAllSubsSubjectPacks = jest.requireActual<
    typeof import("client_api/utils/subscriptions.utils")
  >("client_api/utils/subscriptions.utils").removeAllSubsSubjectPacks;
  return {
    ...jest.requireActual("client_api/utils/subscriptions.utils"),
    removeAllSubsSubjectPacks: jest.fn(removeAllSubsSubjectPacks),
  };
});

import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { signOut } from "client_api/user.api";
import { removeAllSubsSubjectPacks } from "client_api/utils/subscriptions.utils";
import { auth } from "db/client/firebase";

describe("Test client api sign out method", () => {
  let testUser: { uid: string; email: string; displayName: string };

  beforeAll(async () => {
    await globalBeforeAll();
    testUser = registerTestUsers(1)[0];
  });

  beforeEach(async () => {
    if (!auth.currentUser) await signInTestUser(testUser.uid);
  });

  it("Throws an error when the user is not signed in", async () => {
    expect.assertions(2);
    const testUser = registerTestUsers(1)[0];
    await signInTestUser(testUser.uid);
    await auth.signOut();

    await expect(signOut()).toReject();

    expect(removeAllSubsSubjectPacks).not.toHaveBeenCalled();
  });

  it("Signs out when the user document was not created", async () => {
    const testUser = registerTestUsers(1)[0];
    await signInTestUser(testUser.uid);

    await signOut();

    expect(auth.currentUser).toBeNull();
    expect(removeAllSubsSubjectPacks).toHaveBeenCalled();
  });

  it("Signs out when the user document was created", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.id);

    await signOut();

    expect(auth.currentUser).toBeNull();
    expect(removeAllSubsSubjectPacks).toHaveBeenCalled();
  });
});
