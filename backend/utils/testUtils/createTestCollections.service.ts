import adminCollections from "backend/db/adminCollections.firebase";
import TestCollections from "common/models/utilsModels/testCollections.model";

export default async function createTestCollections(
  testCollectionsId: string,
  testsId: string
): Promise<void> {
  const testCollections: TestCollections = {
    id: testCollectionsId,
    testsId: testsId,
    signedInTestUserId: null,
  };
  await adminCollections.testCollections.doc(testCollectionsId).create(testCollections);
}
