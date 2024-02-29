import AllDTOModels from "common/types/allDTOModels.type";
import DTODocRecord from "common/types/history/DTODocRecord.type";
import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import type { Timestamp } from "firebase-admin/firestore";

export default interface HistoryModelDTOSchema {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  /**
   * @minLength 1
   */
  olderHistoryId: string | null;
  /**
   * The history records are sorted from oldest to newest. Their key is an index as in an array
   * 0, 1, 2... Must use a map instead of an array because the firestore does not support the
   * server timestamp inside an array.
   */
  history: {
    [index in string]: DTOModelRecord<AllDTOModels, any, any> | DTODocRecord<string, any>;
  };
  historyRecordsCount: number;
  modificationTime: Timestamp;
}
