/**
 * This model contains user private information
 */
export default interface UserDetails {
  /**
   * Same as corresponding user id.
   * @minLength 1
   */
  id: string;
  hiddenWorkspaceInvitationsIds: string[];
  isDeleted: boolean;
}
