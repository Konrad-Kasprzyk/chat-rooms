import type { tags } from "typia";

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
  isBotUserDocument: boolean;
  modificationTime: Date;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
