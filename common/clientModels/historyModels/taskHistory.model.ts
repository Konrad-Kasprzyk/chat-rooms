import PRIORITIES from "common/constants/priorities.constant";
import Column from "common/types/column.type";
import ModelRecord from "common/types/history/modelRecord.type";
import Label from "common/types/label.type";
import Goal from "../goal.model";
import Task from "../task.model";
import User from "../user.model";

export default interface TaskHistory {
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
  modificationTime: Date;
}
