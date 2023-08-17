export default interface TestCollections {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * Used in global teardown to delete all used test documents.
   * @minLength 1
   */
  testsId: string;
  /**
   * Firebase rules will check the rules as if it were a signed-in user ID.
   * @minLength 1
   */
  signedInTestUserId: string | null;
  /**
   * Firebase rules will check if the actually signed-in user has this ID.
   * @minLength 1
   */
  requiredAuthenticatedUserId: string;
}
