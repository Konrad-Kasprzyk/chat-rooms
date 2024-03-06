import type { Timestamp } from "firebase-admin/firestore";
import type { tags } from "typia";

export default interface UserDTO {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @format email
   */
  email: string;
  username: string;
  workspaceIds: Array<string & tags.MinLength<1>>;
  workspaceInvitationIds: Array<string & tags.MinLength<1>>;
  isBotUserDocument: boolean;
  modificationTime: Timestamp;
}
