import ArchivedTask from "common/types/history/archivedTask.type";
import DocRecord from "common/types/history/docRecord.type";
import HistoryModelSchema from "./historyModelSchema.interface";

/**
 * Stores deleted tasks. They cannot be restored like from the recycle bin.
 */
export default interface ArchivedTasks extends HistoryModelSchema {
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
  history: DocRecord<"docDeleted", ArchivedTask>[];
  historyRecordsCount: number;
  modificationTime: Date;
}
