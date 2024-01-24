import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser, {
  _listenCurrentUserExportedForTesting,
} from "clientApi/user/listenCurrentUser.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of listening the current user document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("After an error and function re-call, returns the current user document.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    const currentUserSubject = listenCurrentUser();
    await firstValueFrom(
      currentUserSubject.pipe(
        filter((user) => user?.id == testUser.uid && !user.dataFromFirebaseAccount)
      )
    );
    if (!_listenCurrentUserExportedForTesting)
      throw new Error("listenCurrentUser.api module didn't export functions for testing.");

    _listenCurrentUserExportedForTesting.setSubjectError();
    await expect(firstValueFrom(currentUserSubject)).toReject();
    const currentUser = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUser.uid && !user.dataFromFirebaseAccount)
      )
    );

    expect(currentUser).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });
});
