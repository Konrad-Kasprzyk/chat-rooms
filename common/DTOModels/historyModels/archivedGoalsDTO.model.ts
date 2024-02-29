import DTODocRecord from "common/types/history/DTODocRecord.type";
import ArchivedGoal from "common/types/history/archivedGoal.type";
import type { Timestamp } from "firebase-admin/firestore";
import HistoryModelDTOSchema from "./historyModelDTOSchema.interface";

/**
 * Stores deleted goals. They cannot be restored like from the recycle bin.
 */
export default interface ArchivedGoalsDTO extends HistoryModelDTOSchema {
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
   * The history records are sorted from oldest to newest. Their key is an index as in an array
   * 0, 1, 2... Must use a map instead of an array because the firestore does not support the
   * server timestamp inside an array.
   */
  history: { [index in string]: DTODocRecord<"docDeleted", ArchivedGoal> };
  historyRecordsCount: number;
  modificationTime: Timestamp;
}
