import LABEL_COLORS from "common/constants/labelColors.constant";
import DTODocRecord from "common/types/history/DTODocRecord.type";
import type { Timestamp } from "firebase-admin/firestore";
import HistoryModelDTOSchema from "./historyModelDTOSchema.interface";

export default interface LabelsHistoryDTO extends HistoryModelDTOSchema {
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
  history: {
    [index in string]: DTODocRecord<
      "created" | "modified" | "deleted",
      { name: string; color: (typeof LABEL_COLORS)[number] }
    >;
  };
  historyRecordsCount: number;
  modificationTime: Timestamp;
}
