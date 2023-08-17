import NormHistory from "common/models/history_models/normHistory.model";
import typia from "typia";

const validateNormHistory = typia.createValidateEquals<NormHistory>();

export default validateNormHistory;
