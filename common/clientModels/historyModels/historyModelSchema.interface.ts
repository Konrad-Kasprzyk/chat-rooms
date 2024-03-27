import AllClientModels from "common/types/allClientModels.type";
import DocRecord from "common/types/history/docRecord.type";
import ModelRecord from "common/types/history/modelRecord.type";

export default interface HistoryModelSchema {
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
   * The history records are sorted from oldest to newest.
   */
  history: (ModelRecord<AllClientModels, any, any> | DocRecord<string, any>)[];
  historyRecordsCount: number;
  modificationTime: Date;
}
