import { Timestamp } from "firebase/firestore";

export default interface Goal {
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
   * @type int
   * @minimum 0
   */
  storyPoints: number;
  index: number;
  /**
   * @type int
   * @minimum 0
   */
  completedTasksCount: number;
  /**
   * @type int
   * @minimum 0
   */
  completedTasksStoryPoints: number;
  columnTasksCount: { [columnId in string]?: number }[];
  columnTasksStoryPoints: { [columnId in string]?: number }[];
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
  deadline: Timestamp | null;
  modificationTime: Timestamp;
  lastTaskCompletionTime: Timestamp | null;
  lastTaskAssignmentTime: Timestamp | null;
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
