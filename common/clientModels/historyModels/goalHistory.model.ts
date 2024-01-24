import ModelRecord from "common/types/history/modelRecord.type";
import Goal from "../goal.model";

export default interface GoalHistory {
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
    | ModelRecord<Goal, "title" | "description", string>
    | ModelRecord<Goal, "storyPoints", number>
    | ModelRecord<Goal, "objectives", Goal["objectives"][number]>
    | ModelRecord<Goal, "notes", Goal["notes"][number]>
    | ModelRecord<Goal, "deadline" | "creationTime" | "placingInBinTime", Date>
  )[];
  modificationTime: Date;
}
