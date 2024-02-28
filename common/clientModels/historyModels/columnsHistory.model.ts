import DocRecord from "common/types/history/docRecord.type";
import HistoryModelSchema from "./historyModelSchema.interface";

export default interface ColumnsHistory extends HistoryModelSchema {
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
  history: DocRecord<
    "created" | "modified" | "deleted",
    { name: string; completedTasksColumn: boolean }
  >[];
  historyRecordsCount: number;
  modificationTime: Date;
}
