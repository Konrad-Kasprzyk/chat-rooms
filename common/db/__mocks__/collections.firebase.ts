import testCollectionsId from "__tests__/utils/testCollections/testCollectionsId.constant";
import createClientCollections from "../createClientCollections.util";
import db from "../db.firebase";

if (!testCollectionsId)
  throw new Error(
    "testCollectionsId is not a non-empty string. This id is for mocking production " +
      "collections and for the backend to use the proper test collections. " +
      "Cannot run tests on production collections."
  );

const testCollections = createClientCollections(db, testCollectionsId);

export default testCollections;
