import { Timestamp } from "firebase/firestore";
import { tags } from "typia";

export default interface User {
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
  modificationTime: Timestamp;
  isDeleted: boolean;
  deletionTime: Timestamp | null;
}
