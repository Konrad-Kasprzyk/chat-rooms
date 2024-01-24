import PRIORITIES from "common/constants/priorities.constant";
import type { Timestamp } from "firebase-admin/firestore";

export default interface TaskDTO {
  /**
   * Used in url, is an integer.
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
  title: string;
  description: string;
  /**
   * May be the id of a deleted user. The client will check if the user belongs to the workspace,
   * if not, the client will not display the task author.
   * @minLength 1
   */
  authorId: string;
  /**
   * May be the id of a deleted user. The client will check if the user belongs to the workspace,
   * if not, the client will not display the user assigned to the task.
   * @minLength 1
   */
  assignedUserId: string | null;
  /**
   * May be the id of a deleted column. If so, the client checks which column replaces it.
   * @minLength 1
   */
  columnId: string;
  hasGoal: boolean;
  /**
   * May be the id of a deleted goal. The client will check if the goal is in the recycle bin, marked as
   * deleted or deleted and display that the task has no goal assigned if this is the case.
   * @minLength 1
   */
  goalId: string | null;
  hasStoryPoints: boolean;
  /**
   * @type int
   * @minimum 0
   */
  storyPoints: number;
  /**
   * Used for manual task position order. When the task position is changed, a median is calculated
   * between two new surrounding task index times. Or index times are swapped if two task are adjacent.
   */
  indexTime: Timestamp;
  hasAnyLabel: boolean;
  /**
   * Can have many labels which will be set to true, rest will be undefined.
   * This weird style instead of labels list is to match firestore query limitations.
   * May contain ids of deleted labels. The client checks which label is missing from the workspace.
   */
  labelIds: { [labelId in string]?: boolean };
  hasPriority: boolean;
  /**
   * Only one priority will be set to true, rest will be undefined.
   * This weird style instead of single 'priority' property is to match firestore query limitations.
   */
  priorities: { [priority in (typeof PRIORITIES)[number]]?: boolean };
  objectives: {
    /**
     * @minLength 1
     */
    objective: string;
    isDone: boolean;
  }[];
  notes: {
    /**
     * May be the id of a deleted user. The client will check if the user belongs to the workspace,
     * if not, the client will not display the user who wrote the note.
     * @minLength 1
     */
    userId: string;
    /**
     * @minLength 1
     */
    note: string;
    date: Timestamp;
  }[];
  modificationTime: Timestamp;
  columnChangeTime: Timestamp;
  completionTime: Timestamp | null;
  creationTime: Timestamp;
  // /**
  //  * @minLength 1
  //  */
  // newestHistoryId: string;
  // /**
  //  * @minLength 1
  //  */
  // oldestHistoryId: string;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  isDeleted: boolean;
  deletionTime: Timestamp | null;
}
