import TestCollections from "common/models/utils_models/testCollections.model";
import typia from "typia";

export const validateTestCollections = typia.createAssertEquals<TestCollections>();

export default validateTestCollections;
