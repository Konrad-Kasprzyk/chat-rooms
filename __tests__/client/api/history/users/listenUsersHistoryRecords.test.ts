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
import _listenNewestUsersHistory from "client/api/history/usersHistory/_listenNewestUsersHistory.api";
import { _listenPreprocessedUsersHistoryRecordsExportedForTesting } from "client/api/history/usersHistory/_listenPreprocessedUsersHistoryRecords.api";
import listenUsersHistoryRecords, {
  _listenUsersHistoryRecordsExportedForTesting,
} from "client/api/history/usersHistory/listenUsersHistoryRecords.api";
import acceptWorkspaceInvitation from "client/api/user/acceptWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import addBotToWorkspace from "client/api/workspace/addBotToWorkspace.api";
import cancelUserInvitationToWorkspace from "client/api/workspace/cancelUserInvitationToWorkspace.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import leaveWorkspace from "client/api/workspace/leaveWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import removeUserFromWorkspace from "client/api/workspace/removeUserFromWorkspace.api";
import retrieveWorkspaceFromRecycleBin from "client/api/workspace/retrieveWorkspaceFromRecycleBin.api";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import User from "common/clientModels/user.model";
import equal from "fast-deep-equal/es6";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

async function assertUserDocsFromHistoryRecordsAreUpdated() {
  const historyRecords = await firstValueFrom(listenUsersHistoryRecords());
  const allUsers = (await firstValueFrom(listenWorkspaceUsers())).docs;
  for (const historyRecord of historyRecords) {
    const userWhoPerformedAction = allUsers.find((userDoc) => userDoc.id === historyRecord.userId);
    if (userWhoPerformedAction)
      expect(equal(userWhoPerformedAction, historyRecord.user)).toBeTrue();
    else expect(historyRecord.user).toBeNull();
    if (historyRecord.action == "users") {
      expect(historyRecord.value).not.toBeNull();
      if (typeof historyRecord.value === "string") {
        const addedUser = allUsers.find((userDoc) => userDoc.id === historyRecord.value);
        expect(addedUser).toBeUndefined();
      } else {
        const addedUser = allUsers.find(
          (userDoc) => userDoc.id === (historyRecord.value as User).id
        );
        expect(addedUser).toBeDefined();
        expect(equal(addedUser, historyRecord.value)).toBeTrue();
      }
    }
  }
}

async function addUsersHistoryRecordsUntilRecordsAreSplit(
  userId: string,
  newestUsersHistoryId: string
) {
  const usersHistoryRecordDTOSchema = {
    action: "userIds" as const,
    userId,
    oldValue: null,
    value: userId,
  };
  let historyDTO = (await adminCollections.userHistories.doc(newestUsersHistoryId).get()).data()!;
  await adminDb.runTransaction(async (transaction) => {
    let areRecordsSplit: boolean = false;
    while (!areRecordsSplit) {
      areRecordsSplit = addHistoryRecord<UsersHistoryDTO>(
        transaction,
        historyDTO,
        usersHistoryRecordDTOSchema,
        adminCollections.userHistories
      );
    }
  });
}

describe("Test listening the users history records.", () => {
  let workspaceId: string;
  let workspaceCreatorId: string;
  let newestUsersHistoryId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Sets the tested modules to their initial state. Sets the users history listener filters to null.
   * Creates a test user, signs in, creates and opens a new workspace.
   */
  beforeEach(async () => {
    if (
      !_listenPreprocessedUsersHistoryRecordsExportedForTesting ||
      !_listenPreprocessedUsersHistoryRecordsExportedForTesting.resetModule
    )
      throw new Error(
        "_listenPreprocessedUsersHistoryRecords.api module didn't export functions for testing."
      );
    if (
      !_listenUsersHistoryRecordsExportedForTesting ||
      !_listenUsersHistoryRecordsExportedForTesting.resetModule
    )
      throw new Error("_listenUsersHistoryRecords.api module didn't export functions for testing.");
    await _listenPreprocessedUsersHistoryRecordsExportedForTesting.resetModule();
    await _listenUsersHistoryRecordsExportedForTesting.resetModule();
    setHistoryListenerState("UsersHistory", null);
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
    newestUsersHistoryId = workspace!.newestUsersHistoryId;
  });

  it("Sends inviting and canceling user invitation history actions", async () => {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];

    await inviteUserToWorkspace(testUser.email);
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 1 &&
            historyRecords[0].action == "invitedUserEmails" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();

    await cancelUserInvitationToWorkspace(testUser.email);
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "invitedUserEmails" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sends inviting and accepting user invitation history actions", async () => {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];

    await inviteUserToWorkspace(testUser.email);
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 1 &&
            historyRecords[0].action == "invitedUserEmails" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();

    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) => user?.id == testUser.uid && user.workspaceInvitationIds.includes(workspaceId)
        )
      )
    );
    await acceptWorkspaceInvitation(workspaceId);
    setOpenWorkspaceId(workspaceId);
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "users" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sends adding and removing user from workspace history actions", async () => {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    const userDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const botId = userDetails?.linkedUserDocumentIds.find((uid) => uid != workspaceCreatorId)!;

    await addBotToWorkspace(botId);
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 1 &&
            historyRecords[0].action == "users" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();

    await removeUserFromWorkspace(botId);
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "userRemovedFromWorkspace" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sends cancelling all user invitations history action", async () => {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    const testUsers = await registerAndCreateTestUserDocuments(2);

    for (const testUser of testUsers) await inviteUserToWorkspace(testUser.email);
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords.every(
              (record) => record.action == "invitedUserEmails" && record.user != null
            )
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();

    await moveWorkspaceToRecycleBin();
    /**
     * As the open workspace is moved to the recycle bin, the open workspace is set to null, the
     * open workspace id is set to null, the history listener filters are set to null and the
     * history records are set to an empty array.
     */
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(filter((historyRecords) => historyRecords.length == 0))
    );
    await retrieveWorkspaceFromRecycleBin(workspaceId);
    setOpenWorkspaceId(workspaceId);
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 3 &&
            historyRecords[0].action == "allInvitationsCancel" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it("Sets user to null if the history record action making user is removed from the workspace", async () => {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
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
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await inviteUserToWorkspace(testUser.email);
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 2 &&
            historyRecords[0].action == "invitedUserEmails" &&
            historyRecords[0].user != null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();

    await leaveWorkspace(workspaceId);

    await switchUserIdBetweenLinkedBotIds(workspaceCreatorId);
    setOpenWorkspaceId(workspaceId);
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    await firstValueFrom(
      listenUsersHistoryRecords().pipe(
        filter(
          (historyRecords) =>
            historyRecords.length == 3 &&
            historyRecords[0].action == "userRemovedFromWorkspace" &&
            historyRecords[0].user == null &&
            historyRecords[1].action == "invitedUserEmails" &&
            historyRecords[1].user == null
        )
      )
    );
    await assertUserDocsFromHistoryRecordsAreUpdated();
  });

  it(
    "Sends proper history records when the newest history document splits half of its " +
      "history records into a separate history document and user loads the first history chunk.",
    async () => {
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(filter((historyRecords) => historyRecords.length == 0))
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeFalsy();

      await addUsersHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestUsersHistoryId);
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1)
        )
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeTrue();
    }
  );

  it(
    "Sends proper history records when the newest history document splits half of its " +
      "history records into a separate history document and user has loaded some history records.",
    async () => {
      const testUser = (await registerAndCreateTestUserDocuments(1))[0];
      await inviteUserToWorkspace(testUser.email);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(filter((historyRecords) => historyRecords.length == 1))
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeTrue();

      await addUsersHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestUsersHistoryId);

      await firstValueFrom(
        listenUsersHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeTrue();
    }
  );

  it(
    "Sends proper history records when the user wants to load the next history chunk and there " +
      "are many chunks to load",
    async () => {
      setHistoryListenerState("UsersHistory", null);
      await addUsersHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestUsersHistoryId);
      await addUsersHistoryRecordsUntilRecordsAreSplit(workspaceCreatorId, newestUsersHistoryId);
      await firstValueFrom(
        _listenNewestUsersHistory().pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == newestUsersHistoryId &&
              newestHistory.history[newestHistory.historyRecordsCount - 1].id ==
                MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT
          )
        )
      );

      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1)
        )
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(
          filter((historyRecords) => historyRecords.length == MAX_HISTORY_RECORDS + 1)
        )
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeFalse();

      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(
          filter(
            (historyRecords) =>
              historyRecords.length == MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1
          )
        )
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeTrue();

      /**
       * Trying to load more chunks when all chunks are loaded should update only the listener filters.
       */
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });
      await firstValueFrom(
        listenUsersHistoryRecords().pipe(
          filter(
            (historyRecords) =>
              historyRecords.length == MAX_HISTORY_RECORDS + HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1
          )
        )
      );
      expect(getHistoryListenerState()!.UsersHistory!.loadMoreChunks).toBeFalse();
      expect(getHistoryListenerState()!.UsersHistory!.allChunksLoaded).toBeTrue();
    }
  );
});
