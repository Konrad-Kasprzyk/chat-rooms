import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import type { Timestamp } from "firebase-admin/firestore";
import GoalDTO from "../goalDTO.model";

export default interface GoalHistoryDTO {
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
    | DTOModelRecord<GoalDTO, "title" | "description", string>
    | DTOModelRecord<GoalDTO, "storyPoints", number>
    | DTOModelRecord<GoalDTO, "objectives", GoalDTO["objectives"][number]>
    | DTOModelRecord<GoalDTO, "notes", GoalDTO["notes"][number]>
    | DTOModelRecord<GoalDTO, "deadline" | "creationTime" | "placingInBinTime", Timestamp>
  )[];
  modificationTime: Timestamp;
}
