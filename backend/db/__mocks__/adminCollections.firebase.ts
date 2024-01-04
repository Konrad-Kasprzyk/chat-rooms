import testCollectionsId from "__tests__/utils/testCollections/testCollectionsId.constant";
import adminDb from "../adminDb.firebase";
import createAdminCollections from "../createAdminCollections.util";

if (!testCollectionsId)
  throw new Error(
    "testCollectionsId is not a non-empty string. This id is for mocking production " +
      "collections and for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
  );

const adminTestCollections = createAdminCollections(adminDb, testCollectionsId);

export default adminTestCollections;
