import NormHistory from "common/models/history_models/normHistory.model";
import typia from "typia";

const validateNormHistory = typia.createAssertEquals<NormHistory>();

export default validateNormHistory;
