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
  /**
   * Contains bots user document ids and a main user document id.
   */
  linkedUserDocumentIds: Array<string & tags.MinLength<1>>;
  isBotUserDocument: boolean;
  dataFromFirebaseAccount: boolean;
  modificationTime: Date;
}
