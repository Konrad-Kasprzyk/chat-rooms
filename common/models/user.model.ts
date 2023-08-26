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
  workspaceInvitationIds: string[];
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
}
