import ColumnsHistory from "common/clientModels/historyModels/columnsHistory.model";
import typia from "typia";

const validateColumnsHistory = typia.createAssertEquals<ColumnsHistory>();

export default validateColumnsHistory;
