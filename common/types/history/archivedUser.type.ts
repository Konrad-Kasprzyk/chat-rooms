/**
 * The document of the user who has left the workspace.
 */
type ArchivedUser = {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @format email
   */
  email: string;
  username: string;
  isBotUserDocument: boolean;
};

export default ArchivedUser;
