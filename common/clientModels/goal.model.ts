import User from "./user.model";

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
  /**
   * Deleted column ids are merged with the ids of the columns replacing them.
   * So all column ids here are present in the workspace.
   */
  columnTasksCount: { [columnId in string]?: number }[];
  /**
   * Deleted column ids are merged with the ids of the columns replacing them.
   * So all column ids here are present in the workspace.
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
  // /**
  //  * @minLength 1
  //  */
  // newestHistoryId: string;
  // /**
  //  * @minLength 1
  //  */
  // oldestHistoryId: string;
  placingInBinTime: Date | null;
}
