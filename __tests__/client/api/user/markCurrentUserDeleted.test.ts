import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedUser from "__tests__/utils/checkDocs/checkDeletedUser.util";
import fetchTestApi from "__tests__/utils/fetchTestApi.util";
import MockedFirebaseUser from "__tests__/utils/mockUsers/mockedFirebaseUser.class";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import markCurrentUserDeleted from "client_api/user/markCurrentUserDeleted.api";
import { getSignedInUserId } from "client_api/user/signedInUserId.utils";
import handleApiResponse from "client_api/utils/handleApiResponse.util";
import { getOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test marking the current user deleted.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Marks the current user deleted.", async () => {
    const actualAuth =
      jest.requireActual<typeof import("common/db/auth.firebase")>(
        "common/db/auth.firebase"
      ).default;
    const email = "testingUser@normkeeper-testing.api";
    const testPassword = "admin1";
    const realUserCredential = await createUserWithEmailAndPassword(
      actualAuth,
      email,
      testPassword
    );
    const testUserId = realUserCredential.user.uid;
    const filename = path.parse(__filename).name;
    const displayName = "Testing user from file: " + filename;
    MockedFirebaseUser.registeredMockUsers.push(
      new MockedFirebaseUser(testUserId, email, displayName)
    );
    const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocument, {
      uid: testUserId,
      email,
      username: displayName,
    });
    await handleApiResponse(res);
    // Sign in the real user
    await signInWithEmailAndPassword(actualAuth, email, testPassword);
    // Sign in the mocked user
    await signInTestUser(testUserId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUserId)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );

    await markCurrentUserDeleted();

    // Test that signing out when the user account does not exist does not throw an error.
    await actualAuth.signOut();
    expect(actualAuth.currentUser).toBeNull();
    await expect(signInWithEmailAndPassword(actualAuth, email, testPassword)).rejects.toThrow(
      "Firebase: Error (auth/user-not-found)."
    );
    expect(getSignedInUserId()).toBeNull();
    expect(getOpenWorkspaceId()).toBeNull();
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails == null))
    );
    await checkDeletedUser(testUserId);
  });
});
