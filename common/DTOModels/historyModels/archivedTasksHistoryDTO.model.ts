import ArchivedDTORecord from "common/types/history/archivedDTORecord.type";
import ArchivedTask from "common/types/history/archivedTask.type";
import type { Timestamp } from "firebase-admin/firestore";

export default interface ArchivedTasksHistoryDTO {
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
  history: ArchivedDTORecord<"docDeleted", ArchivedTask>[];
  modificationTime: Timestamp;
}
