import type { Timestamp } from "firebase-admin/firestore";

export default interface GoalDTO {
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
   * Used for manual goal position ordering. Both first and second indexes are used for ordering.
   * When a goal position is changed, new indexes are calculated based on the average of the
   * indexes of the newly surrounding goals. Or indexes are swapped if two goals are adjacent.
   */
  firstIndex: number;
  /**
   * Used for manual goal position ordering. Both first and second indexes are used for ordering.
   * When a goal position is changed, new indexes are calculated based on the average of the
   * indexes of the newly surrounding goals. Or indexes are swapped if two goals are adjacent.
   */
  secondIndex: number;
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
  // newestHistory: GoalHistoryDTO;
  // oldestHistory: GoalHistoryDTO;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  isDeleted: boolean;
  deletionTime: Timestamp | null;
}
