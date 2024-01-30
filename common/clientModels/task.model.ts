import PRIORITIES from "common/constants/priorities.constant";
import Column from "common/types/column.type";
import Label from "common/types/label.type";
import Goal from "./goal.model";
import User from "./user.model";

export default interface Task {
  /**
   * @minLength 1
   */
  id: string;
  urlNumber: number;
  /**
   * @minLength 1
   */
  workspaceId: string;
  /**
   * @minLength 1
   */
  title: string;
  description: string;
  /**
   * If the author id does not belong to the workspace, the author is set to null.
   */
  author: User | null;
  /**
   * May no longer belong to the workspace.
   * @minLength 1
   */
  authorId: string;
  /**
   * If the assigned user id does not belong to the workspace, the assigned user is set to null.
   */
  assignedUser: User | null;
  /**
   * May no longer belong to the workspace.
   * @minLength 1
   */
  assignedUserId: string | null;
  /**
   * Task always has a column assigned, but can be a null when stored in the indexedDB.
   */
  column: Column | null;
  /**
   * @minLength 1
   */
  columnId: string;
  /**
   * If the goal is in the recycle bin, marked as deleted or deleted, the goal is set to null.
   */
  goal: Goal | null;
  /**
   * May be the id of a goal in the recycle bin, marked as deleted or deleted.
   * @minLength 1
   */
  goalId: string | null;
  /**
   * Set to true when waiting to fetch the goal document.
   */
  isLoadingGoal: boolean;
  storyPoints: number | null;
  /**
   * Used for manual task position ordering. Both first and second indexes are used for ordering.
   * When a task position is changed, new indexes are calculated based on the average of the
   * indexes of the newly surrounding tasks. Or indexes are swapped if two tasks are adjacent.
   */
  firstIndex: number;
  /**
   * Used for manual task position ordering. Both first and second indexes are used for ordering.
   * When a task position is changed, new indexes are calculated based on the average of the
   * indexes of the newly surrounding tasks. Or indexes are swapped if two tasks are adjacent.
   */
  secondIndex: number;
  labels: Label[];
  /**
   * Label ids missing from the workspace are removed.
   * So all label ids here are present in the workspace.
   */
  labelIds: string[];
  priority: (typeof PRIORITIES)[number] | null;
  objectives: {
    /**
     * @minLength 1
     */
    objective: string;
    isDone: boolean;
  }[];
  notes: {
    /**
     * If the id of the user who wrote the note does not belong to the workspace,
     * the user who wrote the note is set to null.
     */
    user: User | null;
    /**
     * May no longer belong to the workspace.
     * @minLength 1
     */
    userId: string;
    /**
     * @minLength 1
     */
    note: string;
    date: Date;
  }[];
  modificationTime: Date;
  columnChangeTime: Date;
  completionTime: Date | null;
  creationTime: Date;
  // newestHistory: TaskHistory;
  // oldestHistory: TaskHistory;
  placingInBinTime: Date | null;
}
