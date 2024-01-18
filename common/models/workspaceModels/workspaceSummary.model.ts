import { Timestamp } from "firebase/firestore";
import { tags } from "typia";

/**
 * Use this model to get the basic info about workspaces to show on user's profile.
 */
export default interface WorkspaceSummary {
  /**
   * Same as corresponding workspace id.
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
  userIds: Array<string & tags.MinLength<1>>;
  invitedUserEmails: Array<string & tags.Format<"email">>;
  modificationTime: Timestamp;
  creationTime: Timestamp;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
  isDeleted: boolean;
}
