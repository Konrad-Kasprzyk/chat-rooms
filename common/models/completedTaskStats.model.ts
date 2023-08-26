import PRIORITIES from "common/constants/priorities.constant";
import { Timestamp } from "firebase/firestore";

export default interface CompletedTaskStats {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  earliestTaskCompleteTime: Timestamp;
  latestTaskCompleteTime: Timestamp;
  stats: {
    /**
     * @minLength 1
     */
    taskId: string;
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
    goalId: string | null;
    /**
     * @type int
     * @minimum 0
     */
    storyPoints: number;
    /**
     * @minLength 1
     */
    labelIds: string[];
    priority: (typeof PRIORITIES)[number] | null;
    completionTime: Timestamp;
  }[];
  modificationTime: Timestamp;
}
