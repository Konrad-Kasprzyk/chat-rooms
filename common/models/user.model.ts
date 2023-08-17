export default interface User {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * Used in completed tasks stats.
   * @minLength 1
   */
  shortId: string;
  /**
   * @format email
   */
  email: string;
  username: string;
  workspaces: {
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
  }[];
  /**
   * @minLength 1
   */
  workspaceIds: string[];
  workspaceInvitations: {
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
  }[];
  /**
   * @minLength 1
   */
  workspaceInvitationIds: string[];
}
