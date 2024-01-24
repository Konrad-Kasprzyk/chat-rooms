import PRIORITIES from "common/constants/priorities.constant";
import DTODocRecord from "common/types/history/DTODocRecord.type";
import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import type { Timestamp } from "firebase-admin/firestore";
import TaskDTO from "../taskDTO.model";

export default interface TaskHistoryDTO {
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
  history: (
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
    | DTOModelRecord<TaskDTO, "completionTime" | "creationTime" | "placingInBinTime", null>
  )[];
  modificationTime: Timestamp;
}
