import ArchivedGoal from "common/types/history/archivedGoal.type";
import ArchivedRecord from "common/types/history/archivedRecord.type";

export default interface ArchivedGoalsHistory {
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
  history: ArchivedRecord<"docDeleted", ArchivedGoal>[];
  modificationTime: Date;
}
