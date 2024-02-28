import ModelRecord from "common/types/history/modelRecord.type";
import Goal from "../goal.model";
import HistoryModelSchema from "./historyModelSchema.interface";

export default interface GoalHistory extends HistoryModelSchema {
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
  history: (
    | ModelRecord<Goal, "title" | "description", string>
    | ModelRecord<Goal, "storyPoints", number>
    | ModelRecord<Goal, "objectives", Goal["objectives"][number]>
    | ModelRecord<Goal, "notes", Goal["notes"][number]>
    | ModelRecord<Goal, "deadline" | "creationTime" | "placingInBinTime", Date>
  )[];
  historyRecordsCount: number;
  modificationTime: Date;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
