/**
 * This file mocks authentication functions to allow signing in other users in tests.
 * Firestore rules will only allow a signed in user with an uid equal to the saved uid in the test
 * collections document to use those test collections. But firestore rules will
 * validate the rules as if a user with uid stored in mocked functions was signed in.
 * When a user is signed into mocked functions, those mocked functions will return that
 * user's document, instead of the real signed in user.
 * This allows faster users creation and signing in.
 */

jest.mock("db/firebase", () => {
  const mockedAuth = jest.requireActual<
    typeof import("__tests__/utils/mockUsers/mockedFirebaseAuth")
  >("__tests__/utils/mockUsers/mockedFirebaseAuth").default;
  return {
    ...jest.requireActual("db/firebase"),
    auth: mockedAuth.Instance,
  };
});

jest.mock("client_api/utils/fetchApi.ts");

jest.mock("common/constants/collections", () => {
  const actualCollections = jest.requireActual<typeof import("common/constants/collections")>(
    "common/constants/collections"
  ).default;
  const getTestCollections = jest.requireActual<
    typeof import("common/test_utils/getTestCollections")
  >("common/test_utils/getTestCollections").default;
  const testCollectionsId = jest.requireActual<
    typeof import("__tests__/utils/setup/testCollectionsId")
  >("__tests__/utils/setup/testCollectionsId").default;
  if (!testCollectionsId)
    throw (
      "testCollectionsId is not a non-empty string. This id is for mocking production collections " +
      "and for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
    );
  const mockedCollections = getTestCollections(actualCollections, testCollectionsId);
  return mockedCollections;
});

import "cross-fetch/polyfill";
