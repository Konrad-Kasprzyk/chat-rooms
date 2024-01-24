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
