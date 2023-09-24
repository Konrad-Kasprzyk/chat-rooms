import adminCollections from "backend/db/adminCollections.firebase";
import TestCollections from "common/models/utils_models/testCollections.model";

export default async function createTestCollections(
  testCollectionsId: string,
  testsId: string,
  requiredAuthenticatedUserId: string
): Promise<void> {
  const testCollections: TestCollections = {
    id: testCollectionsId,
    testsId: testsId,
    signedInTestUserId: null,
    requiredAuthenticatedUserId,
  };
  await adminCollections.testCollections.doc(testCollectionsId).create(testCollections);
}
