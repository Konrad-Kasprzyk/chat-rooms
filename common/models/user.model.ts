import { Timestamp } from "firebase/firestore";

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
  /**
   * @minLength 1
   */
  workspaceIds: string[];
  /**
   * @minLength 1
   */
  workspaceInvitationIds: string[];
  modificationTime: Timestamp;
}
