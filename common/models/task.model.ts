import PRIORITIES from "common/constants/priorities.constant";
import { Timestamp } from "firebase/firestore";

export default interface Task {
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
   * @minLength 1
   */
  authorId: string;
  /**
   * @minLength 1
   */
  assignedUserId: string | null;
  /**
   * @minLength 1
   */
  columnId: string;
  hasGoal: boolean;
  /**
   * @minLength 1
   */
  goalId: string;
  hasStoryPoints: boolean;
  /**
   * @type int
   * @minimum 0
   */
  storyPoints: number;
  index: number;
  hasAnyLabel: boolean;
  /**
   * Can have many labels which will be set to true, rest will be undefined.
   * This weird style instead of labels list is to match firestore query limitations.
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
     * @minLength 1
     */
    userId: string;
    /**
     * @minLength 1
     */
    note: string;
    date: Timestamp;
  }[];
  completionTime: Timestamp | null;
  modificationTime: Timestamp;
  columnChangeTime: Timestamp;
  creationTime: Timestamp;
  // /**
  //  * @minLength 1
  //  */
  // historyId: string;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
  isDeleted: boolean;
  deletionTime: Timestamp | null;
}
