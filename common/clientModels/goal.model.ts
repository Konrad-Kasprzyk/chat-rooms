import User from "./user.model";

export default interface Goal {
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
   * @type int
   * @minimum 0
   */
  storyPoints: number | null;
  /**
   * Position in the array of goals.
   */
  index: number;
  /**
   * @type int
   * @minimum 0
   */
  allTasksCount: number;
  /**
   * @type int
   * @minimum 0
   */
  allTasksStoryPoints: number;
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
  deadline: Date | null;
  modificationTime: Date;
  lastTaskAssignmentTime: Date | null;
  lastTaskCompletionTime: Date | null;
  creationTime: Date;
  // newestHistory: GoalHistory;
  // oldestHistory: GoalHistory;
  placingInBinTime: Date | null;
}
