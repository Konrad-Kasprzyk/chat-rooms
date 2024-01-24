import LABEL_COLORS from "common/constants/labelColors.constant";
import DocRecord from "common/types/history/docRecord.type";

export default interface LabelsHistory {
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
    { name: string; color: (typeof LABEL_COLORS)[number] }
  >[];
  modificationTime: Date;
}
