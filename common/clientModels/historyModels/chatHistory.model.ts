import DocRecord from "common/types/history/docRecord.type";
import HistoryModelSchema from "./historyModelSchema.interface";

/**
 * Stores all chat room messages.
 */
export default interface ChatHistory extends HistoryModelSchema {
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
  history: DocRecord<"message", string>[];
  historyRecordsCount: number;
  modificationTime: Date;
}
