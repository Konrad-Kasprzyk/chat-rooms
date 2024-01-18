import TestCollections from "common/models/utilsModels/testCollections.model";
import typia from "typia";

export const validateTestCollections = typia.createAssertEquals<TestCollections>();

export default validateTestCollections;
