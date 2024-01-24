import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUserDetails, {
  _listenCurrentUserDetailsExportedForTesting,
} from "clientApi/user/listenCurrentUserDetails.api";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of listening the current user details document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("After an error and function re-call, returns the current user details document.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    const currentUserDetailsListener = listenCurrentUserDetails();
    await firstValueFrom(
      currentUserDetailsListener.pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    if (!_listenCurrentUserDetailsExportedForTesting)
      throw new Error("listenCurrentUserDetails.api module didn't export functions for testing.");

    _listenCurrentUserDetailsExportedForTesting.setSubjectError();
    await expect(firstValueFrom(currentUserDetailsListener)).toReject();
    const currentUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );

    expect(currentUserDetails).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });
});
