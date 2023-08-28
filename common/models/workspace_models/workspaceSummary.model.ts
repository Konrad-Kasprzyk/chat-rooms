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
  summaryModificationTime: Timestamp;
  placingInBinTime: Timestamp | null;
}
