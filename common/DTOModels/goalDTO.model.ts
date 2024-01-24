import type { Timestamp } from "firebase-admin/firestore";

export default interface GoalDTO {
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
   * May be the id of a deleted user. The client will check if the user belongs to the workspace, if not,
   * the client will not display the goal author.
   * @minLength 1
   */
  authorId: string;
  /**
   * @type int
   */
  storyPoints: number | null;
  /**
   * Used for manual goal position order. When the goal position is changed, a median is calculated
   * between two new surrounding goal index times. Or index times are swapped if two goals are adjacent.
   */
  indexTime: Timestamp;
  /**
   * May contain ids of deleted columns. The client checks which column is missing in the workspace
   * and which column replaces it.
   */
  columnTasksCount: { [columnId in string]?: number }[];
  /**
   * May contain ids of deleted columns. The client checks which column is missing in the workspace
   * and which column replaces it.
   */
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
     * Could be a deleted user id. The client will check if the user belongs to the workspace,
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
  deadline: Timestamp | null;
  modificationTime: Timestamp;
  lastTaskAssignmentTime: Timestamp | null;
  lastTaskCompletionTime: Timestamp | null;
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