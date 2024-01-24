import DTODocRecord from "common/types/history/DTODocRecord.type";
import type { Timestamp } from "firebase-admin/firestore";

export default interface ColumnsHistoryDTO {
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
  history: DTODocRecord<
    "created" | "modified" | "deleted",
    { name: string; completedTasksColumn: boolean }
  >[];
  modificationTime: Timestamp;
}
