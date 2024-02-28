import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import HALF_OF_MAX_RECORDS_BEFORE_SPLIT from "__tests__/constants/halfOfMaxRecordsBeforeSplit.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import {
  addUsersHistoryRecords,
  addUsersHistoryRecordsUntilRecordsAreSplit,
  createUsersHistoriesWithRecords,
} from "__tests__/utils/history/usersHistory.utils";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import _listenNewestUsersHistory from "client/api/history/usersHistory/_listenNewestUsersHistory.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import auth from "client/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test listening the newest users history document.", () => {
  let workspaceId: string;
  let workspaceCreatorId: string;
  let newestUsersHistoryId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates a new test user, signs in, creates and opens a new workspace.
   */
  beforeEach(async () => {
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
    newestUsersHistoryId = workspace!.newestUsersHistoryId;
    await firstValueFrom(
      _listenNewestUsersHistory().pipe(
        filter((newestHistory) => newestHistory?.id == newestUsersHistoryId)
      )
    );
  });

  it("Returns a null when no workspace is open.", async () => {
    const newestHistoryListener = _listenNewestUsersHistory();
    await firstValueFrom(
      newestHistoryListener.pipe(
        filter((newestHistory) => newestHistory?.id == newestUsersHistoryId)
      )
    );

    setOpenWorkspaceId(null);
    const newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(filter((newestHistory) => newestHistory == null))
    );

    expect(newestHistory).toBeNull();
  });

  it("Returns the newest history document when the open workspace is newly created and just opened.", async () => {
    const newestHistory = (await firstValueFrom(
      _listenNewestUsersHistory().pipe(
        filter((newestHistory) => newestHistory?.id == newestUsersHistoryId)
      )
    ))!;

    expect(newestHistory.historyRecordsCount).toEqual(0);
    expect(newestHistory.history).toBeArrayOfSize(0);
    expect(newestHistory.olderHistoryId).toBeNull();
  });

  it("Returns the updated newest history document when one record is added to an empty record list.", async () => {
    const newestHistoryListener = _listenNewestUsersHistory();
    let newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 0
        )
      )
    );
    const oldModificationTime = newestHistory!.modificationTime;

    await addUsersHistoryRecords(newestUsersHistoryId, 1);
    newestHistory = (await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 1
        )
      )
    ))!;

    expect(newestHistory.historyRecordsCount).toEqual(1);
    expect(newestHistory.history).toBeArrayOfSize(1);
    expect(newestHistory.history[0].id).toEqual(0);
    expect(newestHistory.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Returns the updated newest history document when one record is added to a non-empty record list.", async () => {
    await addUsersHistoryRecords(newestUsersHistoryId, 1);
    const newestHistoryListener = _listenNewestUsersHistory();
    let newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 1
        )
      )
    );
    const oldModificationTime = newestHistory!.modificationTime;

    await addUsersHistoryRecords(newestUsersHistoryId, 1);
    newestHistory = (await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 2
        )
      )
    ))!;

    expect(newestHistory.historyRecordsCount).toEqual(2);
    expect(newestHistory.history).toBeArrayOfSize(2);
    expect(newestHistory.history[0].id).toEqual(0);
    expect(newestHistory.history[1].id).toEqual(1);
    expect(newestHistory.modificationTime).toBeAfter(oldModificationTime);
  });

  it(
    "Returns the updated newest history document when the document has split half of the " +
      "history records for the first time.",
    async () => {
      const newestHistoryListener = _listenNewestUsersHistory();
      let newestHistory = await firstValueFrom(
        newestHistoryListener.pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == newestUsersHistoryId && newestHistory.olderHistoryId == null
          )
        )
      );
      const oldModificationTime = newestHistory!.modificationTime;

      const [updatedNewestHistory, splittedHistory] =
        await addUsersHistoryRecordsUntilRecordsAreSplit(newestUsersHistoryId);
      newestHistory = (await firstValueFrom(
        newestHistoryListener.pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == newestUsersHistoryId && newestHistory.olderHistoryId != null
          )
        )
      ))!;

      expect(newestHistory.olderHistoryId).toEqual(splittedHistory.id);
      expect(newestHistory.historyRecordsCount).toEqual(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(newestHistory!.modificationTime).toBeAfter(oldModificationTime);
    }
  );

  it(
    "Returns the updated newest history document when the document has split half of the " +
      "history records many times.",
    async () => {
      const newestHistoryListener = _listenNewestUsersHistory();
      await createUsersHistoriesWithRecords(3, newestUsersHistoryId, workspaceId);
      let newestHistory = await firstValueFrom(
        newestHistoryListener.pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == newestUsersHistoryId &&
              newestHistory.olderHistoryId != null &&
              newestHistory.history[newestHistory.historyRecordsCount - 1].id ==
                HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 4
          )
        )
      );
      const oldHighestRecordId = newestHistory!.history[newestHistory!.historyRecordsCount - 1].id;
      expect(oldHighestRecordId).toEqual(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 4);
      const oldModificationTime = newestHistory!.modificationTime;

      const [updatedNewestHistory, splittedHistory] =
        await addUsersHistoryRecordsUntilRecordsAreSplit(newestUsersHistoryId);
      newestHistory = (await firstValueFrom(
        newestHistoryListener.pipe(
          filter(
            (newestHistory) =>
              newestHistory?.id == newestUsersHistoryId &&
              newestHistory.history[newestHistory.historyRecordsCount - 1].id > oldHighestRecordId
          )
        )
      ))!;

      expect(newestHistory.history[newestHistory.historyRecordsCount - 1].id).toEqual(
        HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 5
      );
      expect(newestHistory.olderHistoryId).toEqual(splittedHistory.id);
      expect(newestHistory.historyRecordsCount).toEqual(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(newestHistory!.modificationTime).toBeAfter(oldModificationTime);
    }
  );

  it("Returns the updated newest history document after signing out and in.", async () => {
    const newestHistoryListener = _listenNewestUsersHistory();
    let newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 0
        )
      )
    );
    const oldModificationTime = newestHistory!.modificationTime;

    await signOut();
    await addUsersHistoryRecords(newestUsersHistoryId, 1);
    await signInTestUser(workspaceCreatorId);
    setOpenWorkspaceId(workspaceId);
    newestHistory = (await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 1
        )
      )
    ))!;

    expect(newestHistory.historyRecordsCount).toEqual(1);
    expect(newestHistory.history).toBeArrayOfSize(1);
    expect(newestHistory.history[0].id).toEqual(0);
    expect(newestHistory.modificationTime).toBeAfter(oldModificationTime);
  });

  it("Returns the updated newest history document when an another user signs in.", async () => {
    const anotherUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await addUsersToWorkspace(workspaceId, [anotherUserId]);
    const newestHistoryListener = _listenNewestUsersHistory();
    /**
     * There is one record instead of zero, because the another user was added to the workspace.
     */
    let newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 1
        )
      )
    );
    const oldModificationTime = newestHistory!.modificationTime;

    await signOut();
    await addUsersHistoryRecords(newestUsersHistoryId, 1);
    await signInTestUser(anotherUserId);
    setOpenWorkspaceId(workspaceId);
    newestHistory = (await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 2
        )
      )
    ))!;

    expect(newestHistory.historyRecordsCount).toEqual(2);
    expect(newestHistory.history).toBeArrayOfSize(2);
    expect(newestHistory.history[0].id).toEqual(0);
    expect(newestHistory.history[1].id).toEqual(1);
    expect(newestHistory.modificationTime).toBeAfter(oldModificationTime);
    expect(auth.currentUser!.uid).toEqual(anotherUserId);
  });

  it("Returns the updated newest history document when switching the user to a linked bot.", async () => {
    const userDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const botIds = userDetails!.linkedUserDocumentIds.filter((id) => id != workspaceCreatorId);
    const botId = botIds[0];
    await addUsersToWorkspace(workspaceId, [botId]);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.includes(botId))
      )
    );
    const newestHistoryListener = _listenNewestUsersHistory();
    /**
     * There is one record instead of zero, because the another user was added to the workspace.
     */
    let newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 1
        )
      )
    );
    const oldModificationTime = newestHistory!.modificationTime;

    addUsersHistoryRecords(newestUsersHistoryId, 1);
    await switchUserIdBetweenLinkedBotIds(botId);
    newestHistory = (await firstValueFrom(
      newestHistoryListener.pipe(
        filter(
          (newestHistory) =>
            newestHistory?.id == newestUsersHistoryId && newestHistory.historyRecordsCount == 2
        )
      )
    ))!;

    expect(newestHistory.historyRecordsCount).toEqual(2);
    expect(newestHistory.history).toBeArrayOfSize(2);
    expect(newestHistory.history[0].id).toEqual(0);
    expect(newestHistory.history[1].id).toEqual(1);
    expect(newestHistory.modificationTime).toBeAfter(oldModificationTime);
    expect(getSignedInUserId()).toEqual(botId);
  });

  it("Sends null when the updated newest history document is not found", async () => {
    const newestHistoryListener = _listenNewestUsersHistory();
    await firstValueFrom(
      newestHistoryListener.pipe(
        filter((newestHistory) => newestHistory?.id == newestUsersHistoryId)
      )
    );

    await adminCollections.workspaces.doc(workspaceId).update({
      newestUsersHistoryId: "foo",
      modificationTime: FieldValue.serverTimestamp(),
    });
    const newestHistory = await firstValueFrom(
      newestHistoryListener.pipe(filter((newestHistory) => newestHistory == null))
    );

    expect(newestHistory).toBeNull();
    await adminCollections.workspaces.doc(workspaceId).update({
      newestUsersHistoryId,
      modificationTime: FieldValue.serverTimestamp(),
    });
  });
});
