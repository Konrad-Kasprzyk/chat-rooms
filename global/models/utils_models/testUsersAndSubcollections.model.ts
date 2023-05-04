/**
 * Collection for this model is not changed during tests, unlike the other collections
 * This document holds users and subcollections used during testing
 */
export default interface TestUsersAndSubcollections {
  id: string;
  // Registered users without user document created
  registeredOnlyUsers: { uid: string; email: string; password: string; displayName: string }[];
  // Registered users which have user document created
  createdUsers: { uid: string; email: string; password: string; username: string }[];
}
