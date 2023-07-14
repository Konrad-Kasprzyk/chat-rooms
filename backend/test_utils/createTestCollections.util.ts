import COLLECTIONS from "common/constants/collections.constant";
import TestCollections from "common/models/utils_models/testCollections.model";
import { adminDb } from "db/firebase-admin";

export default function createTestCollections(
  testCollectionsId: string,
  testsId: string,
  requiredAuthenticatedUserId: string
) {
  const testCollections: TestCollections = {
    id: testCollectionsId,
    testsId: testsId,
    signedInTestUserId: null,
    requiredAuthenticatedUserId,
  };
  return adminDb
    .collection(COLLECTIONS.testCollections)
    .doc(testCollectionsId)
    .create(testCollections);
}
