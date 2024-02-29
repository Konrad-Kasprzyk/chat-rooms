import HISTORY_DTO_INIT_VALUES from "backend/constants/docsInitValues/historyDTOInitValues.constant";
import MAX_HISTORY_RECORDS from "backend/constants/maxHistoryRecords.constant";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import mapUsersHistoryDTO from "client/utils/mappers/historyMappers/mapUsersHistoryDTO.util";
import HistoryModelDTOSchema from "common/DTOModels/historyModels/historyModelDTOSchema.interface";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import HALF_OF_MAX_RECORDS_BEFORE_SPLIT from "../../constants/halfOfMaxRecordsBeforeSplit.constant";

const usersHistoryDTOSchema = {
  ...HISTORY_DTO_INIT_VALUES,
  workspaceId: "test workspace id",
} satisfies Omit<HistoryModelDTOSchema, "id"> as Omit<UsersHistoryDTO, "id">;

const usersHistoryRecordDTOSchema = {
  action: "invitedUserEmails" as const,
  userId: "test user id",
  oldValue: null,
  value: "foo@email.com",
};

/**
 * Adds new users history records to the provided history document.
 * @returns Updated history document from the database.
 * @throws {Error} If so many history records were added that half of them were split into a new
 * history document.
 */
export async function addUsersHistoryRecords(
  historyId: string,
  howMany: number
): Promise<UsersHistory> {
  let historyDTO = (await adminCollections.userHistories.doc(historyId).get()).data()!;
  await adminDb.runTransaction(async (transaction) => {
    for (let i = 0; i < howMany; i++) {
      const areRecordsSplit: boolean = addHistoryRecord<UsersHistoryDTO>(
        transaction,
        historyDTO,
        usersHistoryRecordDTOSchema,
        adminCollections.userHistories
      );
      if (areRecordsSplit)
        throw new Error(
          "History document has split half of its records into a new history document when " +
            "adding new history records."
        );
    }
  });
  const updatedHistoryDTO = (await adminCollections.userHistories.doc(historyDTO.id).get()).data()!;
  return mapUsersHistoryDTO(updatedHistoryDTO);
}

/**
 * Creates a users history document with the provided number of history records. History records
 * have ids counted from zero as if they were the first history records in the workspace.
 * @returns Created history document from the database.
 * @throws {Error} If the number of records is greater than the maximum number of records before
 * splitting half of them into a new history document.
 */
export async function createUsersHistoryWithRecords(
  recordsCount: number = HALF_OF_MAX_RECORDS_BEFORE_SPLIT,
  workspaceId?: string
): Promise<UsersHistory> {
  const historyDTORef = adminCollections.userHistories.doc();
  const historyDTO: UsersHistoryDTO = {
    ...usersHistoryDTOSchema,
    id: historyDTORef.id,
    workspaceId: workspaceId || usersHistoryDTOSchema.workspaceId,
  };
  await historyDTORef.create(historyDTO);
  if (recordsCount > MAX_HISTORY_RECORDS)
    throw new Error(
      "Provided history records count is greater than the maximum records number before " +
        "splitting half of them into a new history document."
    );
  if (recordsCount > 0) return addUsersHistoryRecords(historyDTORef.id, recordsCount);
  return mapUsersHistoryDTO((await historyDTORef.get()).data()!);
}

/**
 * Adds new users history records to the provided history document until it has split half of
 * them into a new history document.
 * @returns An updated history document and a newly created history document from the database.
 */
export async function addUsersHistoryRecordsUntilRecordsAreSplit(
  historyId: string
): Promise<[UsersHistory, UsersHistory]> {
  let historyDTO = (await adminCollections.userHistories.doc(historyId).get()).data()!;
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
  const updatedHistoryDTO = (await adminCollections.userHistories.doc(historyDTO.id).get()).data()!;
  const newlyCreatedHistoryDTO = (
    await adminCollections.userHistories.doc(updatedHistoryDTO.olderHistoryId!).get()
  ).data()!;
  return [mapUsersHistoryDTO(updatedHistoryDTO), mapUsersHistoryDTO(newlyCreatedHistoryDTO)];
}

/**
 * Creates users history documents with half the maximum number of records before the records are
 * split.
 * @param howMany How many new history documents to create. If newestHistoryId is provided, it does
 * not decrease the the number of new histories to create.
 * @param newestHistoryId If provided, the function will create new history documents based on its
 * records. Otherwise the history records will have ids counted from zero as if they were the first
 * history records in the workspace.
 * @returns Created history documents sorted from newest to oldest including the newest history
 * document.
 * @throws {Error} If history documents count is less than one.
 */
export async function createUsersHistoriesWithRecords(
  howMany: number,
  newestHistoryId?: string,
  workspaceId?: string
): Promise<UsersHistory[]> {
  if (howMany < 1) throw new Error("History documents count is less than one");
  let newestHistoryDocumentId: string;
  if (newestHistoryId) {
    newestHistoryDocumentId = newestHistoryId;
  } else {
    newestHistoryDocumentId = (
      await createUsersHistoryWithRecords(HALF_OF_MAX_RECORDS_BEFORE_SPLIT, workspaceId)
    ).id;
  }
  const histories: UsersHistory[] = [];
  let newestHistoryDocument: UsersHistory | null = null;
  const historiesToCreateCount = newestHistoryId ? howMany : howMany - 1;
  for (let i = 0; i < historiesToCreateCount; i++) {
    const [updatedNewestHistoryDocument, newlyCreatedHistoryDocument] =
      await addUsersHistoryRecordsUntilRecordsAreSplit(newestHistoryDocumentId);
    histories.unshift(newlyCreatedHistoryDocument);
    newestHistoryDocument = updatedNewestHistoryDocument;
  }
  if (newestHistoryDocument) {
    histories.unshift(newestHistoryDocument);
  } else {
    const newestHistoryDocumentDTO = (
      await adminCollections.userHistories.doc(newestHistoryDocumentId).get()
    ).data()!;
    histories.unshift(mapUsersHistoryDTO(newestHistoryDocumentDTO));
  }
  return histories;
}
