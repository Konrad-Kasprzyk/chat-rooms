import adminCollections from "backend/db/adminCollections.firebase";
import TestCollectionsDTO from "common/DTOModels/utilsModels/testCollectionsDTO.model";

export default async function createTestCollections(
  testCollectionsId: string,
  testsId: string
): Promise<void> {
  const testCollections: TestCollectionsDTO = {
    id: testCollectionsId,
    testsId: testsId,
    signedInTestUserId: null,
  };
  await adminCollections.testCollections.doc(testCollectionsId).create(testCollections);
}
