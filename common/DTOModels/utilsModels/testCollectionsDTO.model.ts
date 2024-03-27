export default interface TestCollectionsDTO {
  /**
   * Individual test collection created for a single test file.
   * @minLength 1
   */
  id: string;
  /**
   * Used in the global teardown to delete all test collections.
   * Each test file creates its own test collection.
   * @minLength 1
   */
  testsId: string;
  /**
   * Firebase rules will check the rules as if it were a signed-in user ID.
   * @minLength 1
   */
  signedInTestUserId: string | null;
}
