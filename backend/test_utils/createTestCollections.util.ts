import TestCollections from "common/models/utils_models/testCollections.model";
import { AdminCollections } from "db/admin/firebase-admin";

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
  await AdminCollections.testCollections.doc(testCollectionsId).create(testCollections);
}
