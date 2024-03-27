import ArchivedGoal from "common/types/history/archivedGoal.type";
import DocRecord from "common/types/history/docRecord.type";
import HistoryModelSchema from "./historyModelSchema.interface";

/**
 * Stores deleted goals. They cannot be restored like from the recycle bin.
 */
export default interface ArchivedGoals extends HistoryModelSchema {
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
  history: DocRecord<"docDeleted", ArchivedGoal>[];
  historyRecordsCount: number;
  modificationTime: Date;
}
