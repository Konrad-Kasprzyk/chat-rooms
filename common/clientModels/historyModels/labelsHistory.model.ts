import LABEL_COLORS from "common/constants/labelColors.constant";
import DocRecord from "common/types/history/docRecord.type";
import HistoryModelSchema from "./historyModelSchema.interface";

export default interface LabelsHistory extends HistoryModelSchema {
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
  history: DocRecord<
    "created" | "modified" | "deleted",
    { name: string; color: (typeof LABEL_COLORS)[number] }
  >[];
  historyRecordsCount: number;
  modificationTime: Date;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
