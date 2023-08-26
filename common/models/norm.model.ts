import { Timestamp } from "firebase/firestore";

export default interface Norm {
  /**
   * Used in url, is an integer.
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  description: string;
  startDay: Timestamp;
  endDay: Timestamp;
  /**
   * @minLength 1
   */
  authorId: string;
  /**
   * @type int
   * @minimum 0
   */
  storyPoints: number;
  usersNorm: {
    /**
     * @minLength 1
     */
    userId: string;
    included: boolean;
    /**
     * @type int
     * @minimum 0
     */
    capacityPercentage: number;
    capacityExplanation: string;
  }[];
  modificationTime: Timestamp;
  // /**
  //  * @minLength 1
  //  */
  // historyId: string;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}
