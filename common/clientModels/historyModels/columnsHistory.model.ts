import DocRecord from "common/types/history/docRecord.type";

export default interface ColumnsHistory {
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
   * @minLength 1
   */
  newerHistoryId: string | null;
  history: DocRecord<
    "created" | "modified" | "deleted",
    { name: string; completedTasksColumn: boolean }
  >[];
  modificationTime: Date;
}
