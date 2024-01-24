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
  isDeleted: boolean;
}
