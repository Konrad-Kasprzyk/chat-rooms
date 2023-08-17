import { Timestamp } from "firebase/firestore";

export default interface Norm {
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
  startDay: Timestamp;
  endDay: Timestamp;
  description: string;
  usersNorm: {
    /**
     * @minLength 1
     */
    userId: string;
    /**
     * @type int
     * @minimum 0
     */
    capacityPercentage: number;
    capacityExplanation: string;
    included: boolean;
  }[];
  /**
   * @minLength 1
   */
  authorId: string;
  /**
   * @type int
   * @minimum 0
   */
  storyPoints: number;
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
