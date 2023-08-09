/**
 * This file mocks production collections.
 * This file mocks client authentication functions to allow signing in other users in tests.
 * Firestore rules will only allow a signed in user with an uid equal to the saved uid in the test
 * collections document to use those test collections. But firestore rules will
 * validate the rules as if a user with uid stored in mocked functions was signed in.
 * When a user is signed into mocked functions, those mocked functions will return that
 * user's document, instead of the real signed in user.
 * This allows faster users creation and signing in.
 */

jest.mock("db/client/firebase", () => {
  const testCollectionsId = jest.requireActual<
    typeof import("__tests__/utils/setup/testCollectionsId.constant")
  >("__tests__/utils/setup/testCollectionsId.constant").default;
  if (!testCollectionsId)
    throw (
      "testCollectionsId is not a non-empty string. This id is for mocking production " +
      "collections and for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
    );
  const createClientCollections = jest.requireActual<
    typeof import("db/client/createClientCollections.util")
  >("db/client/createClientCollections.util").default;
  const db = jest.requireActual<typeof import("db/client/firebase")>("db/client/firebase").db;
  const mockedAuth = jest.requireActual<
    typeof import("__tests__/utils/mockUsers/mockedFirebaseAuth.class")
  >("__tests__/utils/mockUsers/mockedFirebaseAuth.class").default;
  return {
    ...jest.requireActual("db/client/firebase"),
    auth: mockedAuth.Instance,
    Collections: createClientCollections(db, testCollectionsId),
  };
});

jest.mock("db/admin/firebase-admin", () => {
  const testCollectionsId = jest.requireActual<
    typeof import("__tests__/utils/setup/testCollectionsId.constant")
  >("__tests__/utils/setup/testCollectionsId.constant").default;
  if (!testCollectionsId)
    throw (
      "testCollectionsId is not a non-empty string. This id is for mocking production " +
      "collections and for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
    );
  const createAdminCollections = jest.requireActual<
    typeof import("db/admin/createAdminCollections.util")
  >("db/admin/createAdminCollections.util").default;
  const adminDb =
    jest.requireActual<typeof import("db/admin/firebase-admin")>("db/admin/firebase-admin").adminDb;
  return {
    ...jest.requireActual("db/admin/firebase-admin"),
    AdminCollections: createAdminCollections(adminDb, testCollectionsId),
  };
});

jest.mock("client_api/utils/fetchApi.util.ts");

import "cross-fetch/polyfill";
