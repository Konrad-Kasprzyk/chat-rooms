import type { tags } from "typia";

/**
 * This model contains user private information
 */
export default interface UserDetailsDTO {
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
   * Contains workspace ids to which any of the linked bots or the main user belong.
   * This array is only updated for the main user. Linked bots must have this empty array.
   */
  allLinkedUserBelongingWorkspaceIds: Array<string & tags.MinLength<1>>;
  /**
   * Counted from 0.
   * @type int
   * @minimum 0
   */
  botNumber: number | null;
}
