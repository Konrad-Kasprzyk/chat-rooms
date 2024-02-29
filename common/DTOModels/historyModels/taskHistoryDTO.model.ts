import PRIORITIES from "common/constants/priorities.constant";
import DTODocRecord from "common/types/history/DTODocRecord.type";
import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import type { Timestamp } from "firebase-admin/firestore";
import TaskDTO from "../taskDTO.model";
import HistoryModelDTOSchema from "./historyModelDTOSchema.interface";

export default interface TaskHistoryDTO extends HistoryModelDTOSchema {
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
      | DTOModelRecord<
          TaskDTO,
          "title" | "description" | "assignedUserId" | "columnId" | "goalId",
          string
        >
      | DTOModelRecord<TaskDTO, "storyPoints", number>
      | DTODocRecord<"labelId", string>
      | DTODocRecord<"priority", (typeof PRIORITIES)[number]>
      | DTOModelRecord<TaskDTO, "objectives", TaskDTO["objectives"][number]>
      | DTOModelRecord<TaskDTO, "notes", TaskDTO["notes"][number]>
      | DTOModelRecord<TaskDTO, "completionTime" | "creationTime" | "placingInBinTime", Timestamp>;
  };
  historyRecordsCount: number;
  modificationTime: Timestamp;
}
