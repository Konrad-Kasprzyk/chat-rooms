import HistoryModelDTOSchema from "common/DTOModels/historyModels/historyModelDTOSchema.interface";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const HISTORY_DTO_INIT_VALUES: Omit<HistoryModelDTOSchema, "id" | "workspaceId"> = {
  olderHistoryId: null,
  history: {},
  historyRecordsCount: 0,
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
};

export default HISTORY_DTO_INIT_VALUES;
