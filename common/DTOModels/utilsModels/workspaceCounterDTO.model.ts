import type { Timestamp } from "firebase-admin/firestore";

export default interface WorkspaceCounterDTO {
  /**
   * Same as the corresponding workspace id.
   * @minLength 1
   */
  id: string;
  /**
   * Url number is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextTaskUrlNumber: number;
  /**
   * Url number is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextGoalUrlNumber: number;
  /**
   * If set, it indicates that a script is running and making changes to the workspace documents.
   * It includes normalizing the task and goal indexes and deleting the column.
   * If the timestamp is old, it indicates that the script had an error and is no longer running.
   */
  scriptTimestamp: Timestamp | null;
  /**
   * Information on organizing the task indexes for each column. Task indexes are organized when
   * they are too close to each other.
   */
  columnsReorganization: {
    columnId: string;
    /**
     * The time at which all column tasks have had their indexes for manual ordering reorganized.
     * If the script for reorganizing the task indexes sees that the column tasks have recently had
     * their indexes reorganized, it will not reorganize the indexes again.
     */
    taskIndexesReorganizationTime: Timestamp | null;
  }[];
  /**
   * The time at which all goals have had their indexes for manual ordering reorganized. If the
   * script for reorganizing the goal indexes sees that the goals have recently had their indexes
   * reorganized, it will not reorganize the indexes again.
   */
  goalIndexesReorganizationTime: Timestamp | null;
}
