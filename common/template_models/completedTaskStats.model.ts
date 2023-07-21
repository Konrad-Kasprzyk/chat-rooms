import { Timestamp } from "firebase/firestore";
import typia from "typia";

export default interface CompletedTaskStats {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  earliestTaskCompleteDate: Timestamp;
  latestTaskCompleteDate: Timestamp;
  taskStats: {
    /**
     * Task short id.
     * @minLength 1
     */
    i: string;
    // Finish time - task completion time.
    f: Timestamp;
    /**
     * Label ids.
     * @minLength 1
     */
    l: string[];
    /**
     * Goal short id.
     * @minLength 1
     */
    g: string | null;
    /**
     * Creator - author short id.
     * @minLength 1
     */
    c: string | null;
    /**
     * Assigned user short id
     * @minLength 1
     */
    a: string | null;
    /**
     * Story points.
     * @type int
     * @minimum 0
     */
    s: number;
    // Priority: low, normal, high or urgent.
    p: "l" | "n" | "h" | "u" | null;
  }[];
  /**
   * @minLength 1
   */
  lastModifiedTaskId: string;
}

export const validateCompletedTaskStats = typia.createValidateEquals<CompletedTaskStats>();
