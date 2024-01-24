import ArchivedDTORecord from "common/types/history/archivedDTORecord.type";
import ArchivedGoal from "common/types/history/archivedGoal.type";
import type { Timestamp } from "firebase-admin/firestore";

export default interface ArchivedGoalsHistoryDTO {
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
  history: ArchivedDTORecord<"docDeleted", ArchivedGoal>[];
  modificationTime: Timestamp;
}
