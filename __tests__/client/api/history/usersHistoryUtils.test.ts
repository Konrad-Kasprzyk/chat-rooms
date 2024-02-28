import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import HALF_OF_MAX_RECORDS_BEFORE_SPLIT from "__tests__/constants/halfOfMaxRecordsBeforeSplit.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import {
  addUsersHistoryRecords,
  addUsersHistoryRecordsUntilRecordsAreSplit,
  createUsersHistoriesWithRecords,
  createUsersHistoryWithRecords,
} from "__tests__/utils/history/usersHistory.utils";
import MAX_HISTORY_RECORDS from "backend/constants/maxHistoryRecords.constant";
import adminCollections from "backend/db/adminCollections.firebase";
import { v4 as uuidv4 } from "uuid";

describe("Test listening the preprocessed users history records.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it(
    "The addUsersHistoryRecords helper function correctly adds the specified number of history " +
      "records to the history document.",
    async () => {
      const historyDocumentId = (await createUsersHistoryWithRecords()).id;

      const updatedHistoryDocument = await addUsersHistoryRecords(
        historyDocumentId,
        HALF_OF_MAX_RECORDS_BEFORE_SPLIT
      );

      expect(updatedHistoryDocument.id).toEqual(historyDocumentId);
      expect(updatedHistoryDocument.history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 2);
      expect(updatedHistoryDocument.history).toHaveLength(
        updatedHistoryDocument.historyRecordsCount
      );
      for (let i = 0; i < updatedHistoryDocument.history.length - 1; i++) {
        expect(updatedHistoryDocument.history[i].id).toEqual(
          updatedHistoryDocument.history[i + 1].id - 1
        );
      }
      const updatedHistoryDocumentDTO = (
        await adminCollections.userHistories.doc(historyDocumentId).get()
      ).data()!;
      expect(updatedHistoryDocumentDTO.historyRecordsCount).toEqual(
        updatedHistoryDocument.historyRecordsCount
      );
    }
  );

  it(
    "The addUsersHistoryRecords helper function throws an error if during adding the specified number " +
      "of records half of them were split into a new history document.",
    async () => {
      const historyDocument = await createUsersHistoryWithRecords();

      await expect(addUsersHistoryRecords(historyDocument.id, MAX_HISTORY_RECORDS)).rejects.toThrow(
        "History document has split half of its records into a new history document when adding new " +
          "history records."
      );
    }
  );

  it(
    "The createUsersHistoryWithRecords helper function correctly creates a history document with zero " +
      "history records.",
    async () => {
      const historyDocument = await createUsersHistoryWithRecords(0);

      expect(historyDocument.history).toHaveLength(0);
      expect(historyDocument.historyRecordsCount).toEqual(0);
      const historyDocumentDTO = (
        await adminCollections.userHistories.doc(historyDocument.id).get()
      ).data()!;
      expect(historyDocumentDTO.historyRecordsCount).toEqual(0);
    }
  );

  it(
    "The createUsersHistoryWithRecords helper function correctly creates a history document with the " +
      "specified number of history records.",
    async () => {
      const historyDocument = await createUsersHistoryWithRecords(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);

      expect(historyDocument.history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      expect(historyDocument.history).toHaveLength(historyDocument.historyRecordsCount);
      for (let i = 0; i < historyDocument.history.length - 1; i++) {
        expect(historyDocument.history[i].id).toEqual(historyDocument.history[i + 1].id - 1);
      }
      const historyDocumentDTO = (
        await adminCollections.userHistories.doc(historyDocument.id).get()
      ).data()!;
      expect(historyDocumentDTO.historyRecordsCount).toEqual(historyDocument.historyRecordsCount);
    }
  );

  it(
    "The createUsersHistoryWithRecords helper function correctly creates a history document with the " +
      "provided workspace id.",
    async () => {
      const workspaceId = uuidv4();

      const historyDocument = await createUsersHistoryWithRecords(
        HALF_OF_MAX_RECORDS_BEFORE_SPLIT,
        workspaceId
      );

      expect(historyDocument.workspaceId).toEqual(workspaceId);
      expect(historyDocument.history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      expect(historyDocument.history).toHaveLength(historyDocument.historyRecordsCount);
      for (let i = 0; i < historyDocument.history.length - 1; i++) {
        expect(historyDocument.history[i].id).toEqual(historyDocument.history[i + 1].id - 1);
      }
      const historyDocumentDTO = (
        await adminCollections.userHistories.doc(historyDocument.id).get()
      ).data()!;
      expect(historyDocumentDTO.historyRecordsCount).toEqual(historyDocument.historyRecordsCount);
    }
  );

  it(
    "The createUsersHistoryWithRecords helper function throws an error if the number of records is " +
      "greater than the maximum number of records before splitting half of them into a new history " +
      "document.",
    async () => {
      await expect(createUsersHistoryWithRecords(MAX_HISTORY_RECORDS + 1)).rejects.toThrow(
        "Provided history records count is greater than the maximum records number before splitting " +
          "half of them into a new history document."
      );
    }
  );

  it(
    "The addUsersHistoryRecordsUntilRecordsAreSplit helper function correctly adds history records to " +
      "the history document until it has split half of them into a new history document.",
    async () => {
      const historyDocumentId = (await createUsersHistoryWithRecords()).id;

      const [updatedHistoryDocument, newlyCreatedHistoryDocument] =
        await addUsersHistoryRecordsUntilRecordsAreSplit(historyDocumentId);

      expect(updatedHistoryDocument.olderHistoryId).toEqual(newlyCreatedHistoryDocument.id);
      expect(newlyCreatedHistoryDocument.olderHistoryId).toBeNull();
      expect(
        updatedHistoryDocument.historyRecordsCount + newlyCreatedHistoryDocument.historyRecordsCount
      ).toEqual(MAX_HISTORY_RECORDS + 1);
      expect(updatedHistoryDocument.history).toHaveLength(
        updatedHistoryDocument.historyRecordsCount
      );
      expect(updatedHistoryDocument.history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      expect(updatedHistoryDocument.history[0].id).toEqual(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      for (let i = 0; i < updatedHistoryDocument.history.length - 1; i++) {
        expect(updatedHistoryDocument.history[i].id).toEqual(
          updatedHistoryDocument.history[i + 1].id - 1
        );
      }
      const updatedHistoryDocumentDTO = (
        await adminCollections.userHistories.doc(historyDocumentId).get()
      ).data()!;
      expect(updatedHistoryDocumentDTO.historyRecordsCount).toEqual(
        updatedHistoryDocument.historyRecordsCount
      );
      expect(newlyCreatedHistoryDocument.history).toHaveLength(
        newlyCreatedHistoryDocument.historyRecordsCount
      );
      expect(newlyCreatedHistoryDocument.history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      expect(newlyCreatedHistoryDocument.history[0].id).toEqual(0);
      for (let i = 0; i < newlyCreatedHistoryDocument.history.length - 1; i++) {
        expect(newlyCreatedHistoryDocument.history[i].id).toEqual(
          newlyCreatedHistoryDocument.history[i + 1].id - 1
        );
      }
      const newlyCreatedHistoryDocumentDTO = (
        await adminCollections.userHistories.doc(newlyCreatedHistoryDocument.id).get()
      ).data()!;
      expect(newlyCreatedHistoryDocumentDTO.historyRecordsCount).toEqual(
        newlyCreatedHistoryDocument.historyRecordsCount
      );
    }
  );

  it(
    "The addUsersHistoryRecordsUntilRecordsAreSplit helper function correctly adds history records to " +
      "the history document until it has split half of them into a new history document when called " +
      "multiple times.",
    async () => {
      const newestHistoryDocument = await createUsersHistoryWithRecords();

      /**
       * Sorted from newest to oldest.
       */
      const histories = [newestHistoryDocument];
      for (let i = 0; i < 3; i++) {
        let [updatedHistoryDocument, newlyCreatedHistoryDocument] =
          await addUsersHistoryRecordsUntilRecordsAreSplit(newestHistoryDocument.id);
        histories[0] = newlyCreatedHistoryDocument;
        histories.unshift(updatedHistoryDocument);
        expect(
          updatedHistoryDocument.historyRecordsCount +
            newlyCreatedHistoryDocument.historyRecordsCount
        ).toEqual(MAX_HISTORY_RECORDS + 1);
        expect(updatedHistoryDocument.history).toHaveLength(
          updatedHistoryDocument.historyRecordsCount
        );
        expect(updatedHistoryDocument.history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
        expect(updatedHistoryDocument.history[0].id).toEqual(
          HALF_OF_MAX_RECORDS_BEFORE_SPLIT + i * HALF_OF_MAX_RECORDS_BEFORE_SPLIT
        );
        expect(newlyCreatedHistoryDocument.history).toHaveLength(
          newlyCreatedHistoryDocument.historyRecordsCount
        );
        expect(newlyCreatedHistoryDocument.history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
        expect(newlyCreatedHistoryDocument.history[0].id).toEqual(
          i * HALF_OF_MAX_RECORDS_BEFORE_SPLIT
        );
        for (let i = 0; i < updatedHistoryDocument.history.length - 1; i++) {
          expect(updatedHistoryDocument.history[i].id).toEqual(
            updatedHistoryDocument.history[i + 1].id - 1
          );
        }
        for (let i = 0; i < newlyCreatedHistoryDocument.history.length - 1; i++) {
          expect(newlyCreatedHistoryDocument.history[i].id).toEqual(
            newlyCreatedHistoryDocument.history[i + 1].id - 1
          );
        }
      }
      /**
       * Sorted from newest to oldest.
       */
      const historyRecords = [];
      for (let i = 0; i < histories.length - 1; i++) {
        expect(histories[i].olderHistoryId).toEqual(histories[i + 1].id);
        historyRecords.push(...histories[i].history.reverse());
      }
      expect(histories[histories.length - 1].olderHistoryId).toBeNull();
      historyRecords.push(...histories[histories.length - 1].history.reverse());
      expect(historyRecords).toHaveLength(histories.length * HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < historyRecords.length - 1; i++) {
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      }
    }
  );

  it(
    "The createUsersHistoriesWithRecords helper function correctly creates a single history " +
      "document with half the maximum number of records before the records are split when the " +
      "newest history document id is not provided.",
    async () => {
      const histories = await createUsersHistoriesWithRecords(1);

      expect(histories).toHaveLength(1);
      expect(histories[0].history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      expect(histories[0].history).toHaveLength(histories[0].historyRecordsCount);
      for (let i = 0; i < histories[0].history.length - 1; i++) {
        expect(histories[0].history[i].id).toEqual(histories[0].history[i + 1].id - 1);
      }
      const historyDocumentDTO = (
        await adminCollections.userHistories.doc(histories[0].id).get()
      ).data()!;
      expect(historyDocumentDTO.historyRecordsCount).toEqual(histories[0].historyRecordsCount);
    }
  );

  it(
    "The createUsersHistoriesWithRecords helper function correctly creates a single history " +
      "document with half the maximum number of records before the records are split when the " +
      "newest history document id is provided.",
    async () => {
      const historyDocument = await createUsersHistoryWithRecords(1);
      expect(historyDocument.history).toHaveLength(1);
      expect(historyDocument.historyRecordsCount).toEqual(1);

      const histories = await createUsersHistoriesWithRecords(1, historyDocument.id);

      expect(histories).toHaveLength(2);
      expect(histories[0].id).toEqual(historyDocument.id);
      expect(histories[0].olderHistoryId).toEqual(histories[1].id);
      expect(histories[1].olderHistoryId).toBeNull();
      expect(histories[0].history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      expect(histories[0].history).toHaveLength(histories[0].historyRecordsCount);
      expect(histories[0].history[0].id).toEqual(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      for (let i = 0; i < histories[0].history.length - 1; i++) {
        expect(histories[0].history[i].id).toEqual(histories[0].history[i + 1].id - 1);
      }
      const newestHistoryDocumentDTO = (
        await adminCollections.userHistories.doc(histories[0].id).get()
      ).data()!;
      expect(newestHistoryDocumentDTO.historyRecordsCount).toEqual(
        histories[0].historyRecordsCount
      );
      expect(histories[1].history).toHaveLength(HALF_OF_MAX_RECORDS_BEFORE_SPLIT);
      expect(histories[1].history).toHaveLength(histories[1].historyRecordsCount);
      expect(histories[1].history[0].id).toEqual(0);
      for (let i = 0; i < histories[1].history.length - 1; i++) {
        expect(histories[1].history[i].id).toEqual(histories[1].history[i + 1].id - 1);
      }
      const olderHistoryDocumentDTO = (
        await adminCollections.userHistories.doc(histories[1].id).get()
      ).data()!;
      expect(olderHistoryDocumentDTO.historyRecordsCount).toEqual(histories[1].historyRecordsCount);
    }
  );

  it(
    "The createUsersHistoriesWithRecords helper function correctly creates many history " +
      "documents with half the maximum number of records before the records are split when the " +
      "workspace id is provided.",
    async () => {
      const workspaceId = uuidv4();

      const histories = await createUsersHistoriesWithRecords(3, undefined, workspaceId);

      expect(histories.every((history) => history.workspaceId == workspaceId)).toBeTrue();
      expect(histories).toHaveLength(3);
      /**
       * Sorted from newest to oldest.
       */
      const historyRecords = [];
      for (let i = 0; i < histories.length; i++) {
        historyRecords.push(...[...histories[i].history].reverse());
        expect(histories[i].history).toHaveLength(
          i == 0 ? HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1 : HALF_OF_MAX_RECORDS_BEFORE_SPLIT
        );
        for (let j = 0; j < histories[i].history.length - 1; j++) {
          expect(histories[i].history[j].id).toEqual(histories[i].history[j + 1].id - 1);
        }
      }
      for (let i = 0; i < histories.length - 1; i++)
        expect(histories[i].olderHistoryId).toEqual(histories[i + 1].id);
      expect(histories[histories.length - 1].olderHistoryId).toBeNull();
      expect(historyRecords).toHaveLength(histories.length * HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < historyRecords.length - 1; i++) {
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      }
    }
  );

  it(
    "The createUsersHistoriesWithRecords helper function correctly creates many history " +
      "documents with half the maximum number of records before the records are split when the " +
      "newest history document id is not provided.",
    async () => {
      const histories = await createUsersHistoriesWithRecords(3);

      expect(histories).toHaveLength(3);
      /**
       * Sorted from newest to oldest.
       */
      const historyRecords = [];
      for (let i = 0; i < histories.length; i++) {
        historyRecords.push(...[...histories[i].history].reverse());
        expect(histories[i].history).toHaveLength(
          i == 0 ? HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1 : HALF_OF_MAX_RECORDS_BEFORE_SPLIT
        );
        for (let j = 0; j < histories[i].history.length - 1; j++) {
          expect(histories[i].history[j].id).toEqual(histories[i].history[j + 1].id - 1);
        }
      }
      for (let i = 0; i < histories.length - 1; i++)
        expect(histories[i].olderHistoryId).toEqual(histories[i + 1].id);
      expect(histories[histories.length - 1].olderHistoryId).toBeNull();
      expect(historyRecords).toHaveLength(histories.length * HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < historyRecords.length - 1; i++) {
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      }
    }
  );

  it(
    "The createHistoriesWithRecords helper function correctly creates many history " +
      "documents with half the maximum number of records before the records are split when the " +
      "newest history document id is provided and it is the only history document in the workspace.",
    async () => {
      const newestHistoryDocument = await createUsersHistoryWithRecords();
      const histories = await createUsersHistoriesWithRecords(3, newestHistoryDocument.id);

      expect(histories[0].id).toEqual(newestHistoryDocument.id);
      expect(histories).toHaveLength(4);
      /**
       * Sorted from newest to oldest.
       */
      const historyRecords = [];
      for (let i = 0; i < histories.length; i++) {
        historyRecords.push(...[...histories[i].history].reverse());
        expect(histories[i].history).toHaveLength(
          i == 0 ? HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1 : HALF_OF_MAX_RECORDS_BEFORE_SPLIT
        );
        for (let j = 0; j < histories[i].history.length - 1; j++) {
          expect(histories[i].history[j].id).toEqual(histories[i].history[j + 1].id - 1);
        }
      }
      for (let i = 0; i < histories.length - 1; i++)
        expect(histories[i].olderHistoryId).toEqual(histories[i + 1].id);
      expect(histories[histories.length - 1].olderHistoryId).toBeNull();
      expect(historyRecords).toHaveLength(histories.length * HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      for (let i = 0; i < historyRecords.length - 1; i++) {
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      }
    }
  );

  it(
    "The createHistoriesWithRecords helper function correctly creates many history " +
      "documents with half the maximum number of records before the records are split when the " +
      "newest history document id is provided and it already had splitted records.",
    async () => {
      const oldHistories = await createUsersHistoriesWithRecords(3);
      const newestHistoryDocument = oldHistories[0];
      const oldHighestRecordId =
        newestHistoryDocument.history[newestHistoryDocument.history.length - 1].id;
      expect(oldHighestRecordId).toEqual(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 3);
      const histories = await createUsersHistoriesWithRecords(3, newestHistoryDocument.id);

      expect(histories[0].id).toEqual(newestHistoryDocument.id);
      expect(histories).toHaveLength(4);
      /**
       * Sorted from newest to oldest.
       */
      const historyRecords = [];
      for (let i = 0; i < histories.length; i++) {
        historyRecords.push(...[...histories[i].history].reverse());
        expect(histories[i].history).toHaveLength(
          i == 0 ? HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1 : HALF_OF_MAX_RECORDS_BEFORE_SPLIT
        );
        for (let j = 0; j < histories[i].history.length - 1; j++) {
          expect(histories[i].history[j].id).toEqual(histories[i].history[j + 1].id - 1);
        }
      }
      for (let i = 0; i < histories.length - 1; i++)
        expect(histories[i].olderHistoryId).toEqual(histories[i + 1].id);
      expect(histories[histories.length - 1].olderHistoryId).toEqual(oldHistories[1].id);
      expect(historyRecords).toHaveLength(histories.length * HALF_OF_MAX_RECORDS_BEFORE_SPLIT + 1);
      const newHighestRecordId = historyRecords[0].id;
      expect(newHighestRecordId).toEqual(HALF_OF_MAX_RECORDS_BEFORE_SPLIT * 6);
      for (let i = 0; i < historyRecords.length - 1; i++) {
        expect(historyRecords[i].id).toEqual(historyRecords[i + 1].id + 1);
      }
    }
  );

  it(
    "The createUsersHistoriesWithRecords helper function throws an error if history documents count is " +
      "less than one.",
    async () => {
      await expect(createUsersHistoriesWithRecords(0)).rejects.toThrow(
        "History documents count is less than one"
      );
    }
  );
});
