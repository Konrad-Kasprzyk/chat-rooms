import PRIORITIES from "common/constants/priorities.constant";
import { Timestamp } from "firebase/firestore";

export default interface Task {
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
  /**
   * @minLength 1
   */
  labelIds: string[];
  /**
   * @minLength 1
   */
  goalId: string | null;
  /**
   * Contains goal short id, label short ids, searchId substrings and substrings of the words of the title.
   * @minLength 1
   */
  searchKeys: string[];
  /**
   * @minLength 1
   */
  columnId: string;
  index: number;
  /**
   * @type int
   * @minimum 0
   */
  storyPoints: number;
  /**
   * @minLength 1
   */
  authorId: string;
  isAssigned: boolean;
  /**
   * @minLength 1
   */
  assignedUserId: string | null;
  priority: (typeof PRIORITIES)[number] | null;
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
  columnChangeTime: Timestamp;
  completionTime: Timestamp | null;
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
