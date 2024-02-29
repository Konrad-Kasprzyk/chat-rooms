import TestCollectionsDTO from "common/DTOModels/utilsModels/testCollectionsDTO.model";
import typia from "typia";

export const validateTestCollectionsDTO = typia.createAssertEquals<TestCollectionsDTO>();

export default validateTestCollectionsDTO;
