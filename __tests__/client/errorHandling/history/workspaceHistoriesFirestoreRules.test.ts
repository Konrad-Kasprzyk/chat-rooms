import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import leaveWorkspace from "client/api/workspace/leaveWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import collections from "client/db/collections.firebase";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test workspaceHistories collection firestore rules denying access.", () => {
  let testUserId: string;
  const filename = path.parse(__filename).name;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the test user.
   */
  beforeEach(async () => {
    testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
  });

  it(
    "The signed in user can't read a workspace history document from a workspace to which he does " +
      "not belong.",
    async () => {
      expect.assertions(1);
      await signInTestUser(testUserId);
      await firstValueFrom(
        listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
      );
      const workspaceId = await createTestWorkspace(filename);
      setOpenWorkspaceId(workspaceId);
      await firstValueFrom(
        listenCurrentUser().pipe(
          filter((user) => user?.id == testUserId && user.workspaceIds.length == 1)
        )
      );
      const workspace = await firstValueFrom(
        listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
      );
      await leaveWorkspace(workspaceId);

      await expect(
        getDoc(doc(collections.workspaceHistories, workspace!.newestWorkspaceHistoryId))
      ).rejects.toThrow(FirebaseError);
    }
  );

  it(
    "The signed in user can't get a list of workspace history documents, even if the list contains " +
      "only workspace history documents from the workspace to which he belongs.",
    async () => {
      expect.assertions(1);
      await signInTestUser(testUserId);
      await firstValueFrom(
        listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
      );
      const workspaceId = await createTestWorkspace(filename);
      setOpenWorkspaceId(workspaceId);
      const workspace = await firstValueFrom(
        listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
      );
      await expect(
        getDocs(
          query(
            collections.workspaceHistories,
            where("workspaceId", "==", workspace!.newestWorkspaceHistoryId)
          )
        )
      ).rejects.toThrow(FirebaseError);
    }
  );
});
