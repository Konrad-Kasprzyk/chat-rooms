import LabelsHistory from "common/clientModels/historyModels/labelsHistory.model";
import typia from "typia";

const validateLabelsHistory = typia.createAssertEquals<LabelsHistory>();

export default validateLabelsHistory;
