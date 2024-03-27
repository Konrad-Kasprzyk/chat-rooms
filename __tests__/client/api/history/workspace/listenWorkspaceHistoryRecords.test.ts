import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import HALF_OF_MAX_RECORDS_BEFORE_SPLIT from "__tests__/constants/halfOfMaxRecordsBeforeSplit.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import MAX_HISTORY_RECORDS from "backend/constants/maxHistoryRecords.constant";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import {
  getHistoryListenerState,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import _listenNewestWorkspaceHistory from "client/api/history/workspaceHistory/_listenNewestWorkspaceHistory.api";
import { _listenPreprocessedWorkspaceHistoryRecordsExportedForTesting } from "client/api/history/workspaceHistory/_listenPreprocessedWorkspaceHistoryRecords.api";
import listenWorkspaceHistoryRecords, {
  _listenWorkspaceHistoryRecordsExportedForTesting,
} from "client/api/history/workspaceHistory/listenWorkspaceHistoryRecords.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import addBotToWorkspace from "client/api/workspace/addBotToWorkspace.api";
import changeWorkspaceDescription from "client/api/workspace/changeWorkspaceDescription.api";
import changeWorkspaceTitle from "client/api/workspace/changeWorkspaceTitle.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import removeUserFromWorkspace from "client/api/workspace/removeUserFromWorkspace.api";
import retrieveWorkspaceFromRecycleBin from "client/api/workspace/retrieveWorkspaceFromRecycleBin.api";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import equal from "fast-deep-equal/es6";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

async function assertUserDocsFromHistoryRecordsAreUpdated() {
  const historyRecords = await firstValueFrom(listenWorkspaceHistoryRecords());
  const allUsers = (await firstValueFrom(listenWorkspaceUsers())).docs;
  for (const historyRecord of historyRecords) {
    const userWhoPerformedAction = allUsers.find((userDoc) => userDoc.id === historyRecord.userId);
    if (userWhoPerformedAction)
      expect(equal(userWhoPerformedAction, historyRecord.user)).toBeTrue();
    else expect(historyRecord.user).toBeNull();
  }
}

async function addWorkspaceHistoryRecordsUntilRecordsAreSplit(
  userId: string,
  newestWorkspaceHistoryId: string
) {
  const workspaceHistoryRecordDTOSchema = {
    action: "description" as const,
    userId,
    oldValue: "foo",
    value: "bar",
  };
  let historyDTO = (
    await adminCollections.workspaceHistories.doc(newestWorkspaceHistoryId).get()
  ).data()!;
  await adminDb.runTransaction(async (transaction) => {
    let areRecordsSplit: boolean = false;
    while (!areRecordsSplit) {
      areRecordsSplit = addHistoryRecord<WorkspaceHistoryDTO>(
        transaction,
        historyDTO,
        workspaceHistoryRecordDTOSchema,
        adminCollections.workspaceHistories
      );
    }
  });
}

describe("Test listening the workspace history records.", () => {
  let workspaceId: string;
  let workspaceCreatorId: string;
  let newestWorkspaceHistoryId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Sets the tested modules to their initial state. Sets the workspace history listener filters to null.
   * Creates a test user, signs in, creates and opens a new workspace.
   */
  beforeEach(async () => {
    if (
      !_listenPreprocessedWorkspaceHistoryRecordsExportedForTesting ||
      !_listenPreprocessedWorkspaceHistoryRecordsExportedForTesting.resetModule
    )
      throw new Error(
        "_listenPreprocessedWorkspaceHistoryRecords.api module didn't export functions for testing."
      );
    if (
      !_listenWorkspaceHistoryRecordsExportedForTesting ||
      !_listenWorkspaceHistoryRecordsExportedForTesting.resetModule
    )
      throw new Error(
        "_listenWorkspaceHistoryRecords.api module didn't export functions for testing."
      );
    await _listenPreprocessedWorkspaceHistoryRecordsExportedForTesting.resetModule();
    await _listenWorkspaceHistoryRecordsExportedForTesting.resetModule();
    setHistoryListenerState("WorkspaceHistory", null);
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) =>
            user?.id == workspaceCreatorId &&
            user.workspaceIds.length == 1 &&
            user.workspaceIds[0] == workspaceId
        )
      )
    );
    newestWorkspaceHistoryId = workspace!.newestWorkspaceHistoryId;
  });

  it("Sends creating the workspace history action", async () => {
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    await firstValueFrom(
      listenWorkspaceHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 1 &&
            historyRecords[0].action == "creationTime" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sends changing title history action", async () => {
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    await changeWorkspaceTitle("foo");

    await firstValueFrom(
      listenWorkspaceHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "title" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sends changing description history action", async () => {
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    await changeWorkspaceDescription("foo");

    await firstValueFrom(
      listenWorkspaceHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "description" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sends putting and retrieving the workspace from the recycle bin history action", async () => {
    await moveWorkspaceToRecycleBin();
    await retrieveWorkspaceFromRecycleBin(workspaceId);

    setOpenWorkspaceId(workspaceId);
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    await firstValueFrom(
      listenWorkspaceHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 3 &&
            historyRecords
              .slice(0, 2)
              .every((record) => record.action == "placingInBinTime" && record.user != null)
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sets user to null if the history record action making user is removed from the workspace", async () => {
    const userDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const botId = userDetails?.linkedUserDocumentIds.find((uid) => uid != workspaceCreatorId)!;
    await addBotToWorkspace(botId);
    await switchUserIdBetweenLinkedBotIds(botId);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    await changeWorkspaceTitle("foo");
    setHistoryListenerState("WorkspaceHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    await firstValueFrom(
      listenWorkspaceHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "title" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();

    await switchUserIdBetweenLinkedBotIds(workspaceCreatorId);
    await removeUserFromWorkspace(botId);

    await firstValueFrom(
      listenWorkspaceHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "title" &&
            historyRecords[0].user == null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it(
    "Sends proper history records when the newest history document splits half of its " +
      "history records into a separate history document and user loads the first history chunk.",
    async () => {
      setHistoryListenerState("WorkspaceHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(filter((historyRecords) => historyRecords.length == 1))
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      // Because the first history document contains the history record for the creation of the workspace.
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeTrue();

      await addWorkspaceHistoryRecordsUntilRecordsAreSplit(
        workspaceCreatorId,
        newestWorkspaceHistoryId
      );

      // Because the listener contains a record for the creation of the workspace, splitting the history
      // records will load the second history document automatically.
      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeTrue();
    }
  );

  it(
    "Sends proper history records when the newest history document splits half of its " +
      "history records into a separate history document and user has loaded some history records.",
    async () => {
      await changeWorkspaceTitle("foo");
      setHistoryListenerState("WorkspaceHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(filter((historyRecords) => historyRecords.length == 2))
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeTrue();

      await addWorkspaceHistoryRecordsUntilRecordsAreSplit(
        workspaceCreatorId,
        newestWorkspaceHistoryId
      );

      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeTrue();
    }
  );

  it(
    "Sends proper history records when the user wants to load the next history chunk and there " +
      "are many chunks to load",
    async () => {
      setHistoryListenerState("WorkspaceHistory", null);
      await addWorkspaceHistoryRecordsUntilRecordsAreSplit(
        workspaceCreatorId,
        newestWorkspaceHistoryId
      );
      await addWorkspaceHistoryRecordsUntilRecordsAreSplit(
        workspaceCreatorId,
        newestWorkspaceHistoryId
      );
      await firstValueFrom(
        _listenNewestWorkspaceHistory().pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == newestWorkspaceHistoryId &&
              newestHistory.history[newestHistory.historyRecordsCount - 1].id ==
                MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT
          )
        )
      );

      setHistoryListenerState("WorkspaceHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1)
        )
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("WorkspaceHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("WorkspaceHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(
          filter(
            (historyRecords) =>
              historyRecords.length == MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1
          )
        )
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeTrue();

      /**
       * Trying to load more chunks when all chunks are loaded should update only the listener filters.
       */
      setHistoryListenerState("WorkspaceHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenWorkspaceHistoryRecords().pipe(
          filter(
            (historyRecords) =>
              historyRecords.length == MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1
          )
        )
      );
      expect(getHistoryListenerState()!.WorkspaceHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.WorkspaceHistory!.allChunksLoaded).toBeTrue();
    }
  );
});
