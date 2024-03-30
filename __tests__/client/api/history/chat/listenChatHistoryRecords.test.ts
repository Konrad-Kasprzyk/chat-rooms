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
import _listenNewestChatHistory from "client/api/history/chatHistory/_listenNewestChatHistory.api";
import { _listenPreprocessedChatHistoryRecordsExportedForTesting } from "client/api/history/chatHistory/_listenPreprocessedChatHistoryRecords.api";
import listenChatHistoryRecords, {
  _listenChatHistoryRecordsExportedForTesting,
} from "client/api/history/chatHistory/listenChatHistoryRecords.api";
import {
  getHistoryListenerState,
  setHistoryListenerState,
} from "client/api/history/historyListenerState.utils";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import addBotToWorkspace from "client/api/workspace/addBotToWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import removeUserFromWorkspace from "client/api/workspace/removeUserFromWorkspace.api";
import sendMessage from "client/api/workspace/sendMessage.api";
import ChatHistoryDTO from "common/DTOModels/historyModels/chatHistoryDTO.model";
import equal from "fast-deep-equal/es6";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

async function assertUserDocsFromHistoryRecordsAreUpdated() {
  const historyRecords = await firstValueFrom(listenChatHistoryRecords());
  const allUsers = (await firstValueFrom(listenWorkspaceUsers())).docs;
  for (const historyRecord of historyRecords) {
    const userWhoPerformedAction = allUsers.find((userDoc) => userDoc.id === historyRecord.userId);
    if (userWhoPerformedAction)
      expect(equal(userWhoPerformedAction, historyRecord.user)).toBeTrue();
    else expect(historyRecord.user).toBeNull();
  }
}

async function addChatHistoryRecordsUntilRecordsAreSplit(
  userId: string,
  newestChatHistoryId: string
) {
  const chatHistoryRecordDTOSchema = {
    action: "message" as const,
    userId,
    oldValue: "",
    value: "foo",
  };
  let historyDTO = (await adminCollections.chatHistories.doc(newestChatHistoryId).get()).data()!;
  await adminDb.runTransaction(async (transaction) => {
    let areRecordsSplit: boolean = false;
    while (!areRecordsSplit) {
      areRecordsSplit = addHistoryRecord<ChatHistoryDTO>(
        transaction,
        historyDTO,
        chatHistoryRecordDTOSchema,
        adminCollections.chatHistories
      );
    }
  });
}

describe("Test listening the chat history records.", () => {
  let workspaceId: string;
  let workspaceCreatorId: string;
  let newestChatHistoryId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Sets the tested modules to their initial state. Sets the chat history listener filters to null.
   * Creates a test user, signs in, creates and opens a new workspace.
   */
  beforeEach(async () => {
    if (
      !_listenPreprocessedChatHistoryRecordsExportedForTesting ||
      !_listenPreprocessedChatHistoryRecordsExportedForTesting.resetModule
    )
      throw new Error(
        "_listenPreprocessedChatHistoryRecords.api module didn't export functions for testing."
      );
    if (
      !_listenChatHistoryRecordsExportedForTesting ||
      !_listenChatHistoryRecordsExportedForTesting.resetModule
    )
      throw new Error("_listenChatHistoryRecords.api module didn't export functions for testing.");
    await _listenPreprocessedChatHistoryRecordsExportedForTesting.resetModule();
    await _listenChatHistoryRecordsExportedForTesting.resetModule();
    setHistoryListenerState("ChatHistory", null);
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
    newestChatHistoryId = workspace!.newestChatHistoryId;
  });

  it("Sends message history action", async () => {
    const message = "foo";
    setHistoryListenerState("ChatHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    await sendMessage(message);

    await firstValueFrom(
      listenChatHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 1 &&
            historyRecords[0].action == "message" &&
            historyRecords[0].user != null &&
            historyRecords[0].value == message
        )
      )
    );
    await firstValueFrom(
      listenWorkspaceUsers().pipe(filter((workspaceUsers) => workspaceUsers.docs.length == 1))
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sets user to null if the history record action making user is removed from the workspace", async () => {
    const message = "foo";
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
    await sendMessage(message);
    setHistoryListenerState("ChatHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    await firstValueFrom(
      listenChatHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 1 &&
            historyRecords[0].action == "message" &&
            historyRecords[0].user != null &&
            historyRecords[0].value == message
        )
      )
    );
    await firstValueFrom(
      listenWorkspaceUsers().pipe(filter((workspaceUsers) => workspaceUsers.docs.length == 2))
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();

    await switchUserIdBetweenLinkedBotIds(workspaceCreatorId);
    await removeUserFromWorkspace(botId);

    await firstValueFrom(
      listenChatHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 1 &&
            historyRecords[0].action == "message" &&
            historyRecords[0].user == null &&
            historyRecords[0].value == message
        )
      )
    );
    await firstValueFrom(
      listenWorkspaceUsers().pipe(filter((workspaceUsers) => workspaceUsers.docs.length == 1))
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it(
    "Sends proper history records when the newest history document splits half of its " +
      "history records into a separate history document and user loads the first history chunk.",
    async () => {
      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenChatHistoryRecords().pipe(filter((historyRecords) => historyRecords.length == 0))
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeUndefined();

      await addChatHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestChatHistoryId);
      await firstValueFrom(
        listenChatHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1)
        )
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenChatHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeTrue();
    }
  );

  it(
    "Sends proper history records when the newest history document splits half of its " +
      "history records into a separate history document and user has loaded some history records.",
    async () => {
      await sendMessage("foo");
      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenChatHistoryRecords().pipe(filter((historyRecords) => historyRecords.length == 1))
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeTrue();

      await addChatHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestChatHistoryId);

      await firstValueFrom(
        listenChatHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeTrue();
    }
  );

  it(
    "Sends proper history records when the user wants to load the next history chunk and there " +
      "are many chunks to load",
    async () => {
      setHistoryListenerState("ChatHistory", null);
      await addChatHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestChatHistoryId);
      await addChatHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestChatHistoryId);
      await firstValueFrom(
        _listenNewestChatHistory().pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == newestChatHistoryId &&
              newestHistory.history[newestHistory.historyRecordsCount - 1].id ==
                MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT
          )
        )
      );

      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenChatHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1)
        )
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenChatHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenChatHistoryRecords().pipe(
          filter(
            (historyRecords) =>
              historyRecords.length == MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1
          )
        )
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeTrue();

      /**
       * Trying to load more chunks when all chunks are loaded should update only the listener filters.
       */
      setHistoryListenerState("ChatHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenChatHistoryRecords().pipe(
          filter(
            (historyRecords) =>
              historyRecords.length == MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1
          )
        )
      );
      expect(getHistoryListenerState()!.ChatHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.ChatHistory!.allChunksLoaded).toBeTrue();
    }
  );
});
