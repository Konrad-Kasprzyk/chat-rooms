import GlobalCounter from "common/models/globalCounter.model";
import typia from "typia";

const validateGlobalCounter = typia.createValidateEquals<GlobalCounter>();

export default validateGlobalCounter;
