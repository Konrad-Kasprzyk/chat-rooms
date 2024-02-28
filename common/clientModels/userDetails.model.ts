import type { tags } from "typia";

/**
 * This model contains user private information
 */
export default interface UserDetails {
  /**
   * Same as corresponding user id.
   * @minLength 1
   */
  id: string;
  hiddenWorkspaceInvitationIds: string[];
  /**
   * Contains bots user document ids and a main user document id.
   */
  linkedUserDocumentIds: Array<string & tags.MinLength<1>>;
  /**
   * Use to distinguish between a main user id and a user's bot ids.
   * @minLength 1
   */
  mainUserId: string;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
