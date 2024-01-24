import ArchivedRecord from "common/types/history/archivedRecord.type";
import ArchivedTask from "common/types/history/archivedTask.type";

export default interface ArchivedTasksHistory {
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
  history: ArchivedRecord<"docDeleted", ArchivedTask>[];
  modificationTime: Date;
}
