import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import listenCurrentUser, {
  _listenCurrentUserExportedForTesting,
} from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of listening the current user document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("After an error, the subject returns the updated user document.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    const newUsername = "changed " + testUser.displayName;
    await signInTestUser(testUser.uid);
    const currentUserSubject = listenCurrentUser();
    await firstValueFrom(currentUserSubject.pipe(filter((user) => user?.id == testUser.uid)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    if (!_listenCurrentUserExportedForTesting)
      throw new Error("listenCurrentUser.api module didn't export functions for testing.");

    _listenCurrentUserExportedForTesting.setSubjectError();
    await changeCurrentUserUsername(newUsername);
    const currentUserDoc = await firstValueFrom(
      currentUserSubject.pipe(
        filter((user) => user?.id == testUser.uid && user.username == newUsername)
      )
    );

    expect(currentUserDoc).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, newUsername);
  });
});
