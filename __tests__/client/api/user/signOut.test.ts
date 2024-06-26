import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import { getOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import auth from "client/db/auth.firebase";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api sign out method", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Signs out when the user document was not created.", async () => {
    const currentUserSubject = listenCurrentUser();
    const currentUserDetailsSubject = listenCurrentUserDetails();
    const testUser = registerTestUsers(1)[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(currentUserSubject.pipe(filter((user) => user == null)));
    await firstValueFrom(
      currentUserDetailsSubject.pipe(filter((userDetails) => userDetails == null))
    );

    await signOut();

    await firstValueFrom(currentUserSubject.pipe(filter((user) => user == null)));
    await firstValueFrom(
      currentUserDetailsSubject.pipe(filter((userDetails) => userDetails == null))
    );
    expect(auth.currentUser).toBeNull();
    expect(getSignedInUserId()).toBeNull();
    expect(getOpenWorkspaceId()).toBeNull();
  });

  it("Signs out when the user document was created.", async () => {
    const currentUserSubject = listenCurrentUser();
    const currentUserDetailsSubject = listenCurrentUserDetails();
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(currentUserSubject.pipe(filter((user) => user?.id == testUser.uid)));
    await firstValueFrom(
      currentUserDetailsSubject.pipe(filter((user) => user?.id == testUser.uid))
    );

    await signOut();

    await firstValueFrom(currentUserSubject.pipe(filter((user) => user == null)));
    await firstValueFrom(currentUserDetailsSubject.pipe(filter((user) => user == null)));
    expect(auth.currentUser).toBeNull();
    expect(getSignedInUserId()).toBeNull();
    expect(getOpenWorkspaceId()).toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });
});
