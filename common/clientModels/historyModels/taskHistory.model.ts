import PRIORITIES from "common/constants/priorities.constant";
import Column from "common/types/column.type";
import ModelRecord from "common/types/history/modelRecord.type";
import Label from "common/types/label.type";
import Goal from "../goal.model";
import Task from "../task.model";
import User from "../user.model";
import HistoryModelSchema from "./historyModelSchema.interface";

export default interface TaskHistory extends HistoryModelSchema {
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
    | ModelRecord<Task, "title" | "description", string>
    | ModelRecord<Task, "assignedUser", User>
    | ModelRecord<Task, "column", Column>
    | ModelRecord<Task, "goal", Goal>
    | ModelRecord<Task, "storyPoints", number>
    | ModelRecord<Task, "labels", Label>
    | ModelRecord<Task, "priority", (typeof PRIORITIES)[number]>
    | ModelRecord<Task, "objectives", Task["objectives"][number]>
    | ModelRecord<Task, "notes", Task["notes"][number]>
    | ModelRecord<Task, "completionTime" | "creationTime" | "placingInBinTime", Date>
  )[];
  historyRecordsCount: number;
  modificationTime: Date;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
