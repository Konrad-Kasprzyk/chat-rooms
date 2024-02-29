import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkUser from "__tests__/utils/checkDTODocs/usableOrInBin/checkUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import hideWorkspaceInvitation from "client/api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails, {
  _listenCurrentUserDetailsExportedForTesting,
} from "client/api/user/listenCurrentUserDetails.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of listening the current user details document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it(
    "After an error, the subject returns the updated user details document " +
      "when signing in a different user.",
    async () => {
      const testUsers = await registerAndCreateTestUserDocuments(2);
      await signInTestUser(testUsers[0].uid);
      const currentUserDetailsListener = listenCurrentUserDetails();
      await firstValueFrom(
        currentUserDetailsListener.pipe(
          filter((userDetails) => userDetails?.id == testUsers[0].uid)
        )
      );
      if (!_listenCurrentUserDetailsExportedForTesting)
        throw new Error("listenCurrentUserDetails.api module didn't export functions for testing.");

      _listenCurrentUserDetailsExportedForTesting.setSubjectError();
      await signInTestUser(testUsers[1].uid);
      const currentUserDetails = await firstValueFrom(
        currentUserDetailsListener.pipe(
          filter((userDetails) => userDetails?.id == testUsers[1].uid)
        )
      );

      expect(currentUserDetails).not.toBeNull();
    }
  );

  it(
    "After an error, the subject returns the updated user details document " +
      "when hiding a workspace invitation.",
    async () => {
      const testUsers = await registerAndCreateTestUserDocuments(2);
      const workspaceCreator = testUsers[0];
      const testUser = testUsers[1];
      await signInTestUser(workspaceCreator.uid);
      const currentUserDetailsListener = listenCurrentUserDetails();
      await firstValueFrom(
        currentUserDetailsListener.pipe(
          filter((userDetails) => userDetails?.id == workspaceCreator.uid)
        )
      );
      const filename = path.parse(__filename).name;
      const workspaceId = await createTestWorkspace(filename);
      await addUsersToWorkspace(workspaceId, [], [testUser.email]);
      await signInTestUser(testUser.uid);
      await firstValueFrom(
        listenCurrentUser().pipe(
          filter(
            (user) => user?.id == testUser.uid && user.workspaceInvitationIds.includes(workspaceId)
          )
        )
      );
      if (!_listenCurrentUserDetailsExportedForTesting)
        throw new Error("listenCurrentUserDetails.api module didn't export functions for testing.");

      hideWorkspaceInvitation(workspaceId);
      _listenCurrentUserDetailsExportedForTesting.setSubjectError();
      const currentUserDetailsDoc = await firstValueFrom(
        currentUserDetailsListener.pipe(
          filter(
            (userDetails) =>
              userDetails?.id == testUser.uid &&
              userDetails.hiddenWorkspaceInvitationIds.includes(workspaceId)
          )
        )
      );

      expect(currentUserDetailsDoc).not.toBeNull();
      await checkUser(testUser.uid);
    }
  );
});
