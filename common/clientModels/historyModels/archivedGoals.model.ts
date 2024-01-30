import ArchivedGoal from "common/types/history/archivedGoal.type";
import ArchivedRecord from "common/types/history/archivedRecord.type";

export default interface ArchivedGoals {
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
  olderArchiveId: string | null;
  archivedDocs: ArchivedRecord<"docDeleted", ArchivedGoal>[];
  modificationTime: Date;
}
