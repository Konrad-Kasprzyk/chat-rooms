import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersHistoryRecords } from "__tests__/utils/history/usersHistory.utils";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import _listenNewestUsersHistory, {
  _listenNewestUsersHistoryExportedForTesting,
} from "client/api/history/usersHistory/_listenNewestUsersHistory.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import auth from "client/db/auth.firebase";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test listening the newest users history document.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  beforeEach(async () => {
    if (auth.currentUser) await signOut();
  });

  it("After an error, the subject returns the updated newest history document.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    const workspace = (await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    ))!;
    const newestHistoryListener = _listenNewestUsersHistory();
    await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == workspace.newestUsersHistoryId &&
            newestHistory.historyRecordsCount == 0
        )
      )
    );
    if (!_listenNewestUsersHistoryExportedForTesting)
      throw new Error("_listenNewestUsersHistory.api module didn't export functions for testing.");

    _listenNewestUsersHistoryExportedForTesting.setSubjectError();
    addUsersHistoryRecords(workspace.newestUsersHistoryId, 1);
    const newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == workspace.newestUsersHistoryId &&
            newestHistory.historyRecordsCount == 1
        )
      )
    );

    expect(newestHistory!.historyRecordsCount).toEqual(1);
  });

  it(
    "After an error, the subject returns the updated newest history document " +
      "when another user signs in.",
    async () => {
      const testUsers = await registerAndCreateTestUserDocuments(2);
      const workspaceCreatorId = testUsers[0].uid;
      const anotherUserId = testUsers[1].uid;
      await signInTestUser(workspaceCreatorId);
      await firstValueFrom(
        listenCurrentUserDetails().pipe(
          filter((userDetails) => userDetails?.id == workspaceCreatorId)
        )
      );
      const filename = path.parse(__filename).name;
      const workspaceId = await createTestWorkspace(filename);
      await addUsersToWorkspace(workspaceId, [anotherUserId]);
      setOpenWorkspaceId(workspaceId);
      const workspace = (await firstValueFrom(
        listenOpenWorkspace().pipe(
          filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 2)
        )
      ))!;
      const newestHistoryListener = _listenNewestUsersHistory();
      await firstValueFrom(
        newestHistoryListener.pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == workspace.newestUsersHistoryId &&
              // Added another user to the workspace.
              newestHistory.historyRecordsCount == 1
          )
        )
      );
      if (!_listenNewestUsersHistoryExportedForTesting)
        throw new Error(
          "_listenNewestUsersHistory.api module didn't export functions for testing."
        );

      _listenNewestUsersHistoryExportedForTesting.setSubjectError();
      addUsersHistoryRecords(workspace.newestUsersHistoryId, 1);
      await signInTestUser(anotherUserId);
      setOpenWorkspaceId(workspaceId);
      const newestHistory = await firstValueFrom(
        newestHistoryListener.pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == workspace.newestUsersHistoryId &&
              newestHistory.historyRecordsCount == 2
          )
        )
      );

      expect(newestHistory!.historyRecordsCount).toEqual(2);
      expect(auth.currentUser!.uid).toEqual(anotherUserId);
    }
  );
});
