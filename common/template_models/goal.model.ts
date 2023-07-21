import { Timestamp } from "firebase/firestore";
import typia from "typia";

export default interface Goal {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  /**
   * Used in url.
   * @type int
   * @minimum 1
   */
  searchId: number;
  /**
   * Used in completed tasks stats.
   * @minLength 1
   */
  shortId: string;
  /**
   * @minLength 1
   */
  title: string;
  description: string;
  index: number;
  /**
   * @minLength 1
   */
  authorId: string;
  /**
   * @type int
   * @minimum 0
   */
  storyPoints: number;
  taskStats: {
    /**
     * @type int
     * @minimum 0
     */
    activeCount: number;
    /**
     * @type int
     * @minimum 0
     */
    totalCount: number;
    /**
     * @type int
     * @minimum 0
     */
    activeStoryPointsSum: number;
    /**
     * @type int
     * @minimum 0
     */
    totalStoryPointsSum: number;
  };
  objectives: {
    /**
     * @minLength 1
     */
    objective: string;
    done: boolean;
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
  creationTime: Timestamp;
  modificationTime: Timestamp;
  lastTaskAssignmentTime: Timestamp | null;
  lastTaskCompletionTime: Timestamp | null;
  deadline: Timestamp | null;
  /**
   * @minLength 1
   */
  lastModifiedTaskId: string | null;
  // /**
  //  * @minLength 1
  //  */
  // historyId: string;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}

export const validateGoal = typia.createValidateEquals<Goal>();
