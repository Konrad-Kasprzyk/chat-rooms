jest.mock<typeof import("client/api/history/_updateNewestHistoryRecords.util")>(
  "client/api/history/_updateNewestHistoryRecords.util",
  () => {
    return {
      __esModule: true,
      default: jest.fn(
        jest.requireActual<typeof import("client/api/history/_updateNewestHistoryRecords.util")>(
          "client/api/history/_updateNewestHistoryRecords.util"
        ).default
      ),
    };
  }
);

import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import { addUsersHistoryRecords } from "__tests__/utils/history/usersHistory.utils";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import _updateNewestHistoryRecords from "client/api/history/_updateNewestHistoryRecords.util";
import { setHistoryListenerState } from "client/api/history/historyListenerState.utils";
import _listenNewestUsersHistory from "client/api/history/usersHistory/_listenNewestUsersHistory.api";
import _listenPreprocessedUsersHistoryRecords, {
  _listenPreprocessedUsersHistoryRecordsExportedForTesting,
} from "client/api/history/usersHistory/_listenPreprocessedUsersHistoryRecords.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test listening the preprocessed users history records.", () => {
  let workspaceId: string;
  let newestUsersHistoryId: string;
  let testModuleFunctions: Exclude<
    typeof _listenPreprocessedUsersHistoryRecordsExportedForTesting,
    undefined
  >;

  /**
   * Extracts the functions exported for testing from the module to be tested.
   * Creates a test user, signs in, creates and opens a new workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    if (
      !_listenPreprocessedUsersHistoryRecordsExportedForTesting ||
      !_listenPreprocessedUsersHistoryRecordsExportedForTesting.setModuleState ||
      !_listenPreprocessedUsersHistoryRecordsExportedForTesting.resetModule
    )
      throw new Error(
        "_listenPreprocessedUsersHistoryRecords.api module didn't export functions for testing."
      );
    testModuleFunctions = _listenPreprocessedUsersHistoryRecordsExportedForTesting;
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    newestUsersHistoryId = workspace!.newestUsersHistoryId;
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Sets the tested module to its initial state, removes all history records and
   * sets the users history listener filters to null.
   */
  beforeEach(async () => {
    await testModuleFunctions.resetModule();
    const allHistories = await adminCollections.userHistories
      .where("workspaceId", "==", workspaceId)
      .get();
    const batch = adminDb.batch();
    batch.update(adminCollections.userHistories.doc(newestUsersHistoryId), {
      olderHistoryId: null,
      history: {},
      historyRecordsCount: 0,
      modificationTime: FieldValue.serverTimestamp(),
    });
    const historySnapsToDelete = allHistories.docs.filter(
      (docSnap) => docSnap.id != newestUsersHistoryId
    );
    for (const historySnap of historySnapsToDelete) batch.delete(historySnap.ref);
    const beforeCommitTime = new Date();
    await batch.commit();
    await firstValueFrom(
      _listenNewestUsersHistory().pipe(
        filter(
          (usersHistory) =>
            usersHistory?.id == newestUsersHistoryId &&
            usersHistory.historyRecordsCount == 0 &&
            usersHistory.modificationTime >= beforeCommitTime
        )
      )
    );
    setHistoryListenerState("UsersHistory", null);
  });

  it("Does not call the history records update function if it is currently running.", async () => {
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });
    const preprocessedHistoryRecordsListener = _listenPreprocessedUsersHistoryRecords();
    await testModuleFunctions.awaitHistoryRecordsUpdates();
    testModuleFunctions.setModuleState({
      isUpdatingHistoryRecords: true,
    });
    jest.clearAllMocks();
    expect(_updateNewestHistoryRecords).not.toHaveBeenCalled();

    await addUsersHistoryRecords(newestUsersHistoryId, 1);
    await firstValueFrom(
      _listenNewestUsersHistory().pipe(
        filter(
          (usersHistory) =>
            usersHistory?.id == newestUsersHistoryId && usersHistory.historyRecordsCount == 1
        )
      )
    );
    /**
     * Simulate 100ms delay.
     */
    await new Promise((f) => setTimeout(f, 100));

    await firstValueFrom(
      preprocessedHistoryRecordsListener.pipe(filter((records) => records.length == 0))
    );
    expect(_updateNewestHistoryRecords).not.toHaveBeenCalled();
    testModuleFunctions.setModuleState({
      isUpdatingHistoryRecords: false,
    });
    await addUsersHistoryRecords(newestUsersHistoryId, 1);
    const historyRecords = await firstValueFrom(
      preprocessedHistoryRecordsListener.pipe(filter((records) => records.length == 2))
    );
    expect(historyRecords).toBeArrayOfSize(2);
    expect(historyRecords[0].id).toEqual(1);
    expect(historyRecords[1].id).toEqual(0);
  });

  it(
    "Does not call the history records update function if the newest history " +
      "document is set to null.",
    async () => {
      const preprocessedHistoryRecordsListener = _listenPreprocessedUsersHistoryRecords();
      await testModuleFunctions.awaitHistoryRecordsUpdates();
      testModuleFunctions.setModuleState({
        newestHistoryDocument: null,
      });
      jest.clearAllMocks();
      expect(_updateNewestHistoryRecords).not.toHaveBeenCalled();

      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });

      expect(_updateNewestHistoryRecords).not.toHaveBeenCalled();
      await addUsersHistoryRecords(newestUsersHistoryId, 1);
      const historyRecords = await firstValueFrom(
        preprocessedHistoryRecordsListener.pipe(filter((records) => records.length == 1))
      );
      expect(historyRecords).toBeArrayOfSize(1);
      expect(historyRecords[0].id).toEqual(0);
    }
  );

  it(
    "Does not call the history records update function if flag for pending " +
      "updates is set to false",
    async () => {}
  );

  it("Does not update the history records subject if the history filters are set to null", async () => {});

  it(
    "Does not update the history records subject if the history filters for given history model " +
      "are set to null",
    async () => {}
  );

  it(
    "Does not update the history records subject if the history filters for given history model " +
      "have changed the records sorting",
    async () => {}
  );

  it("Sends an empty array if the open workspace id is set to null", async () => {});

  it("Sends an empty array if the history filters are set to null", async () => {});

  it("Sends an empty array if there are no any history records", async () => {});

  it("Sends proper history records when there is only one history record to load", async () => {});

  it("Sends proper history records when there is only one history document to update.", async () => {});

  it(
    "Sends proper history records when there are two history documents and the newest " +
      "history document had an update",
    async () => {}
  );

  it("Sends proper history records when a user loads the next history chunk", async () => {});

  it(
    "Sends proper history records when the newest history document had split half of its " +
      "history records into a separate history document",
    async () => {}
  );

  it(
    "Sends proper history records when during updating history records user wanted to load " +
      "the next history chunk",
    async () => {}
  );

  it(
    "Sends proper history records when during updating history records the newest history " +
      "document has been modified",
    async () => {}
  );

  it(
    "Sends proper history records when during updating history records user wanted to load " +
      "the next history chunk and the newest history document had split half of its history " +
      "records into a separate history document",
    async () => {}
  );

  it("Returns the updated history records after signing out and in.", async () => {});

  it("Returns the updated history records when another user signs in.", async () => {});

  it("Returns the updated history records when switching the user to a linked bot.", async () => {});
});
