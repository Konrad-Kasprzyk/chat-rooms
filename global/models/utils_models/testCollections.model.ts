export default interface TestCollections {
  id: string;
  // Used in global teardown to delete all used test documents
  testsId: string;
  // Firebase rules will check the rules as if it were a signed-in user ID.
  signedInTestUserId: string | null;
  // Firebase rules will check if the actually signed-in user has this ID.
  requiredAuthenticatedUserId: string;
}
