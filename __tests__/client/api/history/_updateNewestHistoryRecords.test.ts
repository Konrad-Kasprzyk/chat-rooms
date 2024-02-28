jest.mock<typeof import("client/utils/mappers/historyMappers/mapUsersHistoryDTO.util")>(
  "client/utils/mappers/historyMappers/mapUsersHistoryDTO.util",
  () => {
    const mockDate = new Date();
    const mapUsersHistoryDTO = jest.requireActual<
      typeof import("client/utils/mappers/historyMappers/mapUsersHistoryDTO.util")
    >("client/utils/mappers/historyMappers/mapUsersHistoryDTO.util").default;
    return {
      __esModule: true,
      default: (usersHistoryDTO: any) => {
        /**
         * Mock the time to avoid time differences between the time the history document DTO was
         * created and the time the document is mapped. This enables comparing the history
         * documents based on their history records without having to worry about time differences.
         */
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
        const usersHistory = mapUsersHistoryDTO(usersHistoryDTO);
        /**
         * Must use real timers, because Firestore does not work with fake Jest timers.
         */
        jest.useRealTimers();
        return usersHistory;
      },
    };
  }
);

import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import HALF_OF_MAX_RECORDS_BEFORE_SPLIT from "__tests__/constants/halfOfMaxRecordsBeforeSplit.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import {
  addUsersHistoryRecords,
  addUsersHistoryRecordsUntilRecordsAreSplit,
  createUsersHistoriesWithRecords,
  createUsersHistoryWithRecords,
} from "__tests__/utils/history/usersHistory.utils";
import adminCollections from "backend/db/adminCollections.firebase";
import _updateNewestHistoryRecords from "client/api/history/_updateNewestHistoryRecords.util";
import { setHistoryListenerState } from "client/api/history/historyListenerState.utils";
import mapUsersHistoryDTO from "client/utils/mappers/historyMappers/mapUsersHistoryDTO.util";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";

async function getHistoryDocumentById(historyId: string) {
  const historyDTO = (await adminCollections.userHistories.doc(historyId).get()).data();
  if (!historyDTO) throw new Error(`History document with id ${historyId} does not exist.`);
  return mapUsersHistoryDTO(historyDTO);
}

describe("Test updating history records sorted from newest to oldest.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it(
    "Does not update the history records when no records are loaded and the newest history " +
      "document has no records",
    async () => {
      const newestHistory = await createUsersHistoryWithRecords(0);
      const loadedHistories: UsersHistory[] = [];
      const historyRecords: UsersHistory["history"] = [];
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(newestHistory.history).toBeArrayOfSize(0);
      expect(historyRecords).toBeArrayOfSize(0);
      expect(loadedHistories).toEqual([newestHistory]);
    }
  );

  it("Updates the history records when no records are loaded", async () => {
    const newestHistory = await createUsersHistoryWithRecords();
    const loadedHistories: UsersHistory[] = [];
    const historyRecords: UsersHistory["history"] = [];
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    const allChunksLoaded = await _updateNewestHistoryRecords(
      "UsersHistory",
      newestHistory,
      historyRecords,
      loadedHistories,
      getHistoryDocumentById
    );

    expect(allChunksLoaded).toBeTrue();
    expect(loadedHistories).toEqual([newestHistory]);
    expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
    for (let i = 0; i < newestHistory.history.length - 1; i++)
      expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
    for (let i = 0; i < historyRecords.length - 1; i++)
      expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    expect([...historyRecords]).toEqual(newestHistory.history.reverse());
  });

  it("Updates the history records when only one record is loaded", async () => {
    const initialHistory = await createUsersHistoryWithRecords(1);
    expect(initialHistory.history).toBeArrayOfSize(1);
    const loadedHistories: UsersHistory[] = [initialHistory];
    const historyRecords: UsersHistory["history"] = [...initialHistory.history];
    const newestHistory = await addUsersHistoryRecords(initialHistory.id, 10);
    setHistoryListenerState("UsersHistory", {
      loadMoreChunks: false,
      sort: "newestFirst",
    });

    const allChunksLoaded = await _updateNewestHistoryRecords(
      "UsersHistory",
      newestHistory,
      historyRecords,
      loadedHistories,
      getHistoryDocumentById
    );

    expect(allChunksLoaded).toBeTrue();
    expect(loadedHistories).toEqual([newestHistory]);
    expect(newestHistory.history).toBeArrayOfSize(11);
    for (let i = 0; i < newestHistory.history.length - 1; i++)
      expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
    for (let i = 0; i < historyRecords.length - 1; i++)
      expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    expect([...historyRecords]).toEqual(newestHistory.history.reverse());
  });

  it(
    "Does not update the history records when only one history document " +
      "is loaded and there are no new records",
    async () => {
      const initialHistory = await createUsersHistoryWithRecords();
      const loadedHistories: UsersHistory[] = [initialHistory];
      const historyRecords: UsersHistory["history"] = [...initialHistory.history].reverse();
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory: UsersHistory = structuredClone(initialHistory);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([initialHistory]);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      expect([...historyRecords]).toEqual(newestHistory.history.reverse());
    }
  );

  it(
    "Updates the history records when only one history document " +
      "is loaded and there are new records",
    async () => {
      const initialHistory = await createUsersHistoryWithRecords();
      const loadedHistories: UsersHistory[] = [initialHistory];
      const historyRecords: UsersHistory["history"] = [...initialHistory.history].reverse();
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory = await addUsersHistoryRecords(initialHistory.id, 10);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([newestHistory]);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 10);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      expect([...historyRecords]).toEqual(newestHistory.history.reverse());
    }
  );

  it(
    "Does not update the history records when two history documents " +
      "are loaded and there are no new records",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(2);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory = structuredClone(loadedHistories[0]);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual(initialHistories);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 2 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when two history documents " +
      "are loaded and there are new records",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(2);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory = await addUsersHistoryRecords(loadedHistories[0].id, 10);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([newestHistory, initialHistories[1]]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 11);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 2 + 11);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Does not update the history records when at least three history documents " +
      "are loaded and there are no new records",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(3);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory = structuredClone(loadedHistories[0]);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual(initialHistories);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when at least three history documents " +
      "are loaded and there are new records",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(3);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory = await addUsersHistoryRecords(loadedHistories[0].id, 10);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([newestHistory, ...initialHistories.slice(1, 3)]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 11);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3 + 11);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when when no records are loaded and the newest history " +
      "document has split half of its history records into a separate history document",
    async () => {
      const loadedHistories: UsersHistory[] = [];
      const historyRecords: UsersHistory["history"] = [];
      const [newestHistory, splitHistory] = await createUsersHistoriesWithRecords(2);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual([newestHistory]);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when only one history document is loaded and the newest history " +
      "document has split half of its history records into a separate history document",
    async () => {
      const initialHistory: UsersHistory = await createUsersHistoryWithRecords();
      const loadedHistories: UsersHistory[] = [initialHistory];
      const historyRecords: UsersHistory["history"] = [...initialHistory.history].reverse();
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const [newestHistory, splitHistory] = await addUsersHistoryRecordsUntilRecordsAreSplit(
        initialHistory.id
      );
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([newestHistory, splitHistory]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 2 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when two history documents are loaded and the newest history " +
      "document has split half of its history records into a separate history document",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(2);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const [newestHistory, splitHistory] = await addUsersHistoryRecordsUntilRecordsAreSplit(
        loadedHistories[0].id
      );
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([newestHistory, splitHistory, initialHistories[1]]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when at least three history documents are loaded and the newest " +
      "history document has split half of its history records into a separate history document",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(3);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const [newestHistory, splitHistory] = await addUsersHistoryRecordsUntilRecordsAreSplit(
        loadedHistories[0].id
      );
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([
        newestHistory,
        splitHistory,
        ...initialHistories.slice(1, 3),
      ]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 4 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Does not update the history records when not all history documents are loaded, the flag to " +
      "load more history chunks is not set, and there are no new records",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(7);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories).slice(0, 3);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory = structuredClone(loadedHistories[0]);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual(initialHistories.slice(0, 3));
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when not all history documents are loaded, the flag to load " +
      "more history chunks is set, and there are new records",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(7);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories).slice(0, 3);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newestHistory = await addUsersHistoryRecords(loadedHistories[0].id, 10);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual([newestHistory, ...initialHistories.slice(1, 4)]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 11);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 4 + 11);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when not all history documents are loaded, the flag to load " +
      "more history chunks is set, and the newest history document has split half of its history " +
      "records into a separate history document",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(7);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories).slice(0, 3);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const [newestHistory, splitHistory] = await addUsersHistoryRecordsUntilRecordsAreSplit(
        loadedHistories[0].id
      );
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual([
        newestHistory,
        splitHistory,
        ...initialHistories.slice(1, 4),
      ]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 5 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when only one history document is loaded, the flag to load more " +
      "history chunks is not set, and the newest history document has split half of its history " +
      "records into a separate history document many times, so there are many missing history " +
      "documents in the chain of history documents",
    async () => {
      const initialHistory: UsersHistory = await createUsersHistoryWithRecords();
      const loadedHistories: UsersHistory[] = [initialHistory];
      const historyRecords: UsersHistory["history"] = [...initialHistory.history].reverse();
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newHistories = await createUsersHistoriesWithRecords(3, initialHistory.id);
      const newestHistory = newHistories[0];
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual(newHistories.slice(0, 2));
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(
        newHistories.slice(0, 2).reduce((count, history) => count + history.historyRecordsCount, 0)
      );
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when two history documents are loaded, the flag to load more " +
      "history chunks is not set, and the newest history document has split half of its history " +
      "records into a separate history document many times, so there are many missing history " +
      "documents in the chain of history documents",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(7);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories).slice(0, 2);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newHistories = await createUsersHistoriesWithRecords(3, loadedHistories[0].id);
      const newestHistory = newHistories[0];
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual([...newHistories, initialHistories[1]]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(
        HALF_OF_MAX_RECORDS_BEFORE_SPLIT +
          newHistories.reduce((count, history) => count + history.historyRecordsCount, 0)
      );
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when at least three history documents are loaded, the flag to " +
      "load more history chunks is not set, and the newest history document has split half of its " +
      "history records into a separate history document many times, so there are many missing " +
      "history documents in the chain of history documents",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(7);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories).slice(0, 3);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newHistories = await createUsersHistoriesWithRecords(3, loadedHistories[0].id);
      const newestHistory = newHistories[0];
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: false,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual([...newHistories, ...initialHistories.slice(1, 3)]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(
        HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 2 +
          newHistories.reduce((count, history) => count + history.historyRecordsCount, 0)
      );
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records when not all history documents are loaded, the flag to load " +
      "more history chunks is set, and the newest history document has split half of its history " +
      "records into a separate history document many times, so there are many missing history " +
      "documents in the chain of history documents",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(7);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories).slice(0, 3);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      const newHistories = await createUsersHistoriesWithRecords(3, loadedHistories[0].id);
      const newestHistory = newHistories[0];
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeFalse();
      expect(loadedHistories).toEqual([...newHistories, ...initialHistories.slice(1, 4)]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(
        HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3 +
          newHistories.reduce((count, history) => count + history.historyRecordsCount, 0)
      );
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Does not update the history records and does not throw an error when all history documents " +
      "are loaded, the flag to load more history chunks is set, and there are no older history " +
      "documents to load",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(3);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      const newestHistory = structuredClone(loadedHistories[0]);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual(initialHistories);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3 + 1);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );

  it(
    "Updates the history records and does not throw an error when all history documents are " +
      "loaded, the flag to load more history chunks is set, and there are no older history " +
      "documents to load",
    async () => {
      const initialHistories: UsersHistory[] = await createUsersHistoriesWithRecords(3);
      const loadedHistories: UsersHistory[] = structuredClone(initialHistories);
      const historyRecords: UsersHistory["history"] = [
        ...[...loadedHistories[0].history].reverse(),
        ...[...loadedHistories[1].history].reverse(),
        ...[...loadedHistories[2].history].reverse(),
      ];
      const newestHistory = await addUsersHistoryRecords(loadedHistories[0].id, 10);
      setHistoryListenerState("UsersHistory", {
        loadMoreChunks: true,
        sort: "newestFirst",
      });

      const allChunksLoaded = await _updateNewestHistoryRecords(
        "UsersHistory",
        newestHistory,
        historyRecords,
        loadedHistories,
        getHistoryDocumentById
      );

      expect(allChunksLoaded).toBeTrue();
      expect(loadedHistories).toEqual([newestHistory, ...initialHistories.slice(1, 3)]);
      for (let i = 0; i < loadedHistories.length - 1; i++)
        expect(loadedHistories[i].olderHistoryId).toEqual(loadedHistories[i + 1].id);
      expect(newestHistory.history).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 11);
      for (let i = 0; i < newestHistory.history.length - 1; i++)
        expect(newestHistory.history[i].id).toEqual(newestHistory.history[i + 1].id - 1);
      expect(historyRecords).toBeArrayOfSize(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3 + 11);
      for (let i = 0; i < historyRecords.length - 1; i++)
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
    }
  );
});
