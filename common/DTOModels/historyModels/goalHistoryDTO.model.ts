import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import type { Timestamp } from "firebase-admin/firestore";
import GoalDTO from "../goalDTO.model";
import HistoryModelDTOSchema from "./historyModelDTOSchema.interface";

export default interface GoalHistoryDTO extends HistoryModelDTOSchema {
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
    [index in string]:
      | DTOModelRecord<GoalDTO, "title" | "description", string>
      | DTOModelRecord<GoalDTO, "storyPoints", number>
      | DTOModelRecord<GoalDTO, "objectives", GoalDTO["objectives"][number]>
      | DTOModelRecord<GoalDTO, "notes", GoalDTO["notes"][number]>
      | DTOModelRecord<GoalDTO, "deadline" | "creationTime" | "placingInBinTime", Timestamp>;
  };
  historyRecordsCount: number;
  modificationTime: Timestamp;
}
