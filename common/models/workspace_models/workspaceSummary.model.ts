import { Timestamp } from "firebase/firestore";

/**
 * Use this model to get the basic info about workspaces to show on user's profile.
 */
export default interface WorkspaceSummary {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * In addition to being an url, it is also an id of WorkspaceUrl.
   * @minLength 1
   */
  url: string;
  /**
   * @minLength 1
   */
  title: string;
  description: string;
  /**
   * @minLength 1
   */
  userIds: string[];
  /**
   * @minLength 1
   */
  invitedUserIds: string[];
  modificationTime: Timestamp;
  creationTime: Timestamp;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}
