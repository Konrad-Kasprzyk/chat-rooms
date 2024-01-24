type ArchivedGoal = {
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
  authorUsername: string | null;
  /**
   * @type int
   * @minimum 0
   */
  storyPoints: number | null;
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
  objectives: {
    /**
     * @minLength 1
     */
    objective: string;
    isDone: boolean;
  }[];
  notes: {
    userUsername: string | null;
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
  placingInBinTime: Date | null;
};

export default ArchivedGoal;
