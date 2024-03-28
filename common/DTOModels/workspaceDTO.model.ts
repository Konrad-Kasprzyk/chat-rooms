import type { Timestamp } from "firebase-admin/firestore";
import type { tags } from "typia";

export default interface WorkspaceDTO {
  /**
   * @minLength 1
   */
  id: string;
  /**
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
  /**
   * Stores all chat room messages.
   * @minLength 1
   */
  newestChatHistoryId: string;
  /**
   * Stores who created the workspace. Stores information about changing the title and description
   * of the workspace. Stores information about putting and restoring workspace from the recycle bin.
   * @minLength 1
   */
  newestWorkspaceHistoryId: string;
  /**
   * Stores information about adding and removing users from the workspace.
   * Stores information about inviting users and cancelling user invitations.
   * @minLength 1
   */
  newestUsersHistoryId: string;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  isDeleted: boolean;
  deletionTime: Timestamp | null;
}
